const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
mongoose.connect("mongodb://localhost:27017/userDB");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// <------------------------------------------------------->
const userSchema = new mongoose.Schema({
  em: String,
  pwd: String,
});
// <------------------------------------------------------->

const user = mongoose.model("user", userSchema);
// <------------------------------------------------------->
app.get("/", (req, res) => {
  res.render("home");
});

// <------------------------------------------------------->
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 13, function (err, hash) {
    const newUser = new user({
      em: req.body.username,
      pwd: hash,
    });
    newUser.save((err) => {
      if (!err) {
        res.render("login");
      } else {
        res.send(err);
      }
    });
  });
});

// <------------------------------------------------------->
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  user.findOne({ em: req.body.username }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(
          req.body.password,
          foundUser.pwd,
          function (err, result) {
            if (result) {
              res.render("secrets");
            }else{
              res.send("WRONG PASSWWORDDD!!!")
            }
          }
        );
      }
    } else {
      console.log(err);
    }
  });
});

// <------------------------------------------------------->
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
