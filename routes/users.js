var express = require('express');
var router = express.Router();
const { addUser, getUserWithEmail } = require('../helpers/database_helper'); 

/* GET users listing. */
module.exports = (db) => {
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/', function(req, res, next) {
    addUser(db, req.body);
    res.send('respond with a resource');
  });
  return router; 
}; 
