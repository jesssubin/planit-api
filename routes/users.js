const express = require('express');
const router = express.Router();

const { addUser, getUserWithEmail } = require('../helpers/database_helper'); 

/* GET users listing. */
module.exports = (db) => {
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/', function(req, res, next) {
    if (!name || !email || !password || !confirmPassword) {
      //error please input all forms
      res.render("/")
    } else {
      addUser(db, req.body);
      res.redirect('/');
    }
  });
  return router; 
}; 
