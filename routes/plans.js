const router = require("express").Router();
const { createPlan } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {
  
  router.post('/', function(req, res, next) {
   
    const date = req.body.date;
    const userID = req.session.userId;
    const plan = { date, userID }
    
    createPlan(db, plan)
    .then(plans => {  
      return res.send(plans);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  return router;
  
};