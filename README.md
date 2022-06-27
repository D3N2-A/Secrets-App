# Secrets App

Simple web application made while learning authentication and security.

6 Levels of securitywas implemented starting from basic comparison of plain text from database to oAuth 2.0.



## Level 1 
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
