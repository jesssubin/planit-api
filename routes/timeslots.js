const router = require("express").Router();
const { createActivity, myTimeslots, deleteTimeslot, createTimeslot, getTimeslotsForPlan } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {

  //get timeslots for specific plan - set order by start time in DB helper
  // router.get('/', function(req, res, next) {
  //   console.log("this is req times get", req)
  //   console.log("req.body", req.body)
  //   console.log("res timeslot get", res)
  //   const userId = req.session.userId;
  //   const planId = "something I don't know yet"
  //   myTimeslots(db, userId, planId)
  //   .then(timeslots => {
  //     return res.send(timeslots)
  //   })
  // })
  // this is for the drop down menu for adding an activity to a timeslot
  router.get('/', function(req, res, next) {
    const userId = req.session.userId;
    console.log("reqbody!!", req.body)
    console.log("reqsess!!", req.session.userId)

    myActivePlans(db, userId)
    .then(plans => {

      return res.send(plans);
    })
    .catch(e => {
      return res.send(e)
    });
  });
  router.post('/timeslot', function(req, res, next) {
    //const { name, address, types } = req.body;

    const time = {
      "activity": req.body.activity,
      "plan": req.body.plan,
      "start_time": req.body.start_time,
      "end_time": req.body.end_time}

    createTimeslot(db, time)
    .then(time => {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          error: 'req body cannot be empty',
        });
      }
      return res.send(time);
    })
    .catch(e => {
      return res.send(e)
    });
  });
 
  router.post('/', function(req, res, next) {
    const activities = req.body;
    
    console.log("activities here", activities)
    createActivity(db, activities)
    .then(activity => {
      const { id, name, formatted_address, types } = activity
      const activityResponse = { id, name, formatted_address, types }
      if (!user) {
        return res.status(400).json({
          status: 'error',
          error: 'req body cannot be empty',
        });
      }
      return res.send(activityResponse);
    })
    .catch(e => {
      return res.send(e)
    });
  });


  router.get('/planlist', function(req, res, next) {
    const planId = req.body.planId;
    console.log("reqbody planlist!!", req.body)

    getTimeslotsByPlan(db, planId)
    .then(timeslotsByPlan => {
      console.log("timeslots by plan return ", timeslotsByPlan)
      return res.send(timeslotsByPlan);
    })
    .catch(e => {
      return res.send(e)
    });
  });


  //delete a timeslot route
  // router.delete('/', function(req, res, next) {
        // const user = req.session.userId;
        // console.log("timeslot put", req.body);
        // const timeslotId = req.body
        // deleteTimeslot(db, user, timeslotId)
  // })

  //update a timeslot
  // router.put('/', function(req, res, next) {

  // })

  return router;
  
};