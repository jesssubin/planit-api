const router = require("express").Router();
const { createPlan, myPlans } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {

  //get all plans for user
  router.get('/', function(req, res, next) {
    const user = req.session.userId;
    //get all plans for user
    myPlans(db, user)
    .then(plans => {
      return res.send(plans)
    })
  })
  
  //add plan to database for user
  router.post('/', function(req, res, next) {
    console.log("Hello HELLO", req.body); 
    const name = req.body.name;
    const date = req.body.date;
    const userID = req.session.userId;
    const plan = { name, date, userID }
    
    createPlan(db, plan)
    .then(plans => {  
      return res.send("plan was created in database!", plans);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  

  return router;
  
};