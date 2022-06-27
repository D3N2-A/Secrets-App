# Secrets App

Simple web application made while learning authentication and security.

6 Levels of securitywas implemented starting from basic comparison of plain text from database to oAuth 2.0.



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
  
  
  
