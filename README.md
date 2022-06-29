# Secrets App

Simple web application made while learning authentication and security.

6 Levels of securitywas implemented starting from basic comparison of plain text from database to OAuth 2.0 and Google authentication.



## Level 1 <sub>Plain text</sub>
![hv](https://img.shields.io/badge/Highly_Vulnerable-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=F40000)

This method simply compares the user entered password in with plain text pass stored in database

```javascript
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
  ```

## Level 2 <sub>Key-encryption</sub>
![mv](https://img.shields.io/badge/Moderately_Vulnerable-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=FFA500)

This method mongoose-encryption to automatically encrypt and decrypt password and strores secret key in form of enviornment variable.

```javascript
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["pwd"] });
  ```
  

## Level 3 <sub>Hashing</sub>
![hv](https://img.shields.io/badge/Highly_Vulnerable-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=F40000)

This method stores passwords in form of md5 hashes in database and and then compares input password by converting into md5.

```javascript
  user.findOne({ em: req.body.username }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        if (foundUser.pwd === md5(req.body.password)) {
          res.render("secrets");
        }
      }
    } else {
      console.log(err);
    }
  });
  ```
  
## Level 4 <sub>Hashing + Salting</sub>
![s](https://img.shields.io/badge/Secure-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=00FF00)

This method uses advanced hashing method bcrypt for hashing and salting multiple times.

```javascript
> bcrypt.hash(req.body.password, 13, (err, hash)=>{
  //Storing password into DB
};

> user.findOne({ em: req.body.username }, (err, foundUser) => {
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
  ```
  
  
## Level 5 <sub>🍪</sub>
![hs](https://img.shields.io/badge/Highly_Secure-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=00FF00)

>![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) (passport, passport-local-mongoose)

This method uses passport js for authentication processes such as salting, hashing, registration, authentication and ending user session.

```javascript
> userSchema.plugin(passportLocalMongoose); 
  //saltiing and hashing

> user.register(
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

  > req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
  ```
  
## Level 6 <sub>OAuth 2.0</sub>
![hs](https://img.shields.io/badge/Highly_Secure-100000?style=for-the-badge&logo=&logoColor=white&labelColor=FF0000&color=00FF00)

>![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) (passport,passport-google-oauth2, passport-local-mongoose ,mongoose-findorcreate)

This method uses passport js for authentication processes such as salting, hashing, registration, authentication and ending user session.

```javascript
> passport.use(
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

> const tr = new user({
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
  }); //login method
  ```
  
