var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { addUser, getUserWithEmail, hashedPassword, userFromCookie } = require('../helpers/database_helper'); 

/* GET users listing. */
module.exports = (db) => {

  router.get('/loggedin', function(req, res, next) {
    if(req.session.userId) {
      userFromCookie(db, req.session.userId)
      .then(user =>{
        res.send(user);
      })
    } else {
      res.send(null);
    }
  });


  router.get('/register', function(req, res, next) {
    res.send(req.session);
  });

  router.post('/register', function(req, res, next) {
    const { password, email } = req.body;
    const userPassword = hashedPassword(password);
    req.body.password = userPassword;
    const user = req.body;
    getUserWithEmail(db, email)
    .then(response => {
      if (response) {
        res.status(400).json({
          status: 'error',
          msg: 'user with this email already exists',
        });
      } else {
        addUser(db, user)
        .then(user => {
          if (!user) {
            return res.status(400).json({
              status: 'error',
              error: 'req body cannot be empty',
            });
          }
          currentUser = user;
          req.session.userId = user.id;
          return res.send("login");
        })
      }
    })
    .catch(e => {
      return res.send(e)
    });
  });

  router.get("/login", (request, response) => {
    console.log(req.session.id);
    if (userFromCookie(db, req.session.id)) { //if logged in
      res.redirect("/");
    }
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    getUserWithEmail(db, email)
      .then(user => {
        console.log(user)
        if (user === undefined) {
          return res.status(400).json({
            status: 'error',
            error: 'email not in database',
          });
        } else {
          console.log("hello world")
          console.log(bcrsypt.compareSync(password, user.password));
          if (bcrypt.compareSync(password, user.password)) {
            
            req.session.userId = user.id;
            res.json({user});
          } else {
            return res.status(400).json({
              status: 'error',
              error: 'password does not match',
            });
          }
        }
      })
      .catch(e => {
        return res.send(e)
      });
  });

  router.post("/logout", function(req, res) {
    req.session = null;
    res.send(req.session)
  })
  return router; 
}; 
