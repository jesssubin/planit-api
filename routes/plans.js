const router = require("express").Router();
const { myActivePlans, myPreviousPlans, archivePlan, createPlan } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {
  
  router.get('/', function(req, res, next) {
    const userId = req.session.userId;
    myActivePlans(db, userId)
    .then(favourites => {
      //const favourite = {activityID: activity.id, userID: userId}
      console.log(favourites)
      // createFavourites(db, favourite)

      // console.log("reqbody: ", req.body) <-- activity without id
      // console.log("activity: ", activity) <-- activity with id
      
      // if (!user) {
      //   return res.status(400).json({
      //     status: 'error',
      //     error: 'req body cannot be empty',
      //   });
      // }
      return res.send(favourites);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  router.post('/plan', function(req, res, next) {
    //const { name, address, types } = req.body;
    console.log("this is req.session: ", req.session)
    const plan = {
      "name": req.body.name,
      "date": req.body.date,
      "userID": req.session.userId}

    createPlan(db, plan)
    .then(plans => {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          error: 'req body cannot be empty',
        });
      }
      return res.send(plans);
    })
    .catch(e => {
      return res.send(e)
    });
  });
  
  //archive plan
  router.post('/archive', function(req, res) {
    console.log(req.body, "plans")
    const planId = req.body.planId
    archivePlan(db, planId)
    .then(plan => {
      console.log(plan)
    })
  })

  router.get('/history', function(req, res, next) {
    const userId = req.session.userId;
    myPreviousPlans(db, userId)
    .then(favourites => {
      //const favourite = {activityID: activity.id, userID: userId}
      console.log(favourites)
    
      return res.send(favourites);
    })
    .catch(e => {
      return res.send(e)
    });
  });
  
  return router;

};