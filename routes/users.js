var express = require('express');
var router = express.Router();
const { addUser, getUserWithEmail, hashedPassword } = require('../helpers/database_helper'); 

/* GET users listing. */
module.exports = (db) => {
  router.get('/', function(req, res, next) {
    res.send(req.session);
  });

  router.post('/', function(req, res, next) {
    const { password } = req.body;
    const userPassword = hashedPassword(password);
    req.body.password = userPassword;
    const user = req.body;
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
      return res.redirect("/");
    })
    .catch(e => {
      return res.send(e)
    });
  });
  return router; 
}; 
