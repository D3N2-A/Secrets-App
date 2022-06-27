const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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
  username: String,
  password: String,
});
userSchema.plugin(passportLocalMongoose); //saltiing and hashing
// <------------------------------------------------------->

const user = mongoose.model("user", userSchema);
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
// <------------------------------------------------------->
app.get("/", (req, res) => {
  res.render("home");
});

// <------------------------------------------------------->
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
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

app.post("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
// <------------------------------------------------------->
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
