require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
app.use(
  session({
    secret: "thisisoursecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// <------------------------------------------------------->
const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
  password: String,
  secret: String,
});
userSchema.plugin(passportLocalMongoose); //saltiing and hashing
userSchema.plugin(findOrCreate);
// <------------------------------------------------------->

const user = mongoose.model("user", userSchema);
passport.use(user.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      user.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

// <------------------------------------------------------->
app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);
// <------------------------------------------------------->
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    user.find({ secrets: { $ne: null } }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("secrets", { userSecrets: foundUser });
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/register", (req, res) => {
  user.register(
    { username: req.body.username, active: false },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});

// <------------------------------------------------------->
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const tr = new user({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(tr, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});
// <------------------------------------------------------->
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});
app.post("/submit", (req, res) => {
  user.findById(req.user._id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      foundUser.secret = req.body.secret;
      foundUser.save(() => {
        res.redirect("/secrets");
      });
    }
  });
});
// <------------------------------------------------------->

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// <------------------------------------------------------->
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
