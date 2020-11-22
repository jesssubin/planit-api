const express = require('express');
const router = express.Router();
const { addUser, getUserWithEmail } = require('../helpers/database_helper'); 

/* GET users listing. */
module.exports = (db) => {
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    res.render("register");
  });
  router.post('/', (req, res) => {
  //   const user = req.body;
  //   console.log(req.body)
    // res.send('respond with a resource');
    // addUser(db, user)
  // .then(user => {
  //   if (!user) {
  //     return res.status(400).json({
  //       status: 'error',
  //       error: 'req body cannot be empty',
  //     });
  //   }
  //   currentUser = user;
  //   req.session.userId = user.id;
  //   return res.redirect("/register");
  // })
  //   .catch(e => {
  //     return res.send(e)
  //   });
  console.log("Yay, a post!!1!111!")
  });
  return router; 
}; 
