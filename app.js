const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const encrypt = require("mongoose-encryption");
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
var secret = "secretappencryptionkey";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["pwd"] });
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
  const newUser = new user({
    em: req.body.username,
    pwd: req.body.password,
  });
  newUser.save((err) => {
    if (!err) {
      res.render("login");
    } else {
      res.send(err);
    }
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
        if (foundUser.pwd === req.body.password) {
          res.render("secrets");
        }
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
