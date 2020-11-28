const router = require("express").Router();
const { createActivity, myTimeslots, deleteTimeslot, createTimeslot, getTimeslotsForPlan, getActivityById, updateTimeslot } = require('../helpers/database_helper'); 
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

 
  router.post('/', function(req, res, next) {
    const { name, address, types, plan, start_time, end_time } = req.body;
    const activity = { name, address, types }
    console.log("activities here", req.body)
    createActivity(db, activity)
    .then(activityRes => {
      const { id, name, formatted_address, types } = activityRes
      //const activityResponse = { id, name, formatted_address, types }
      const time = {
        "activity_id": activityRes.id,
        "plan_id": plan,
        "start_time": start_time,
        "end_time": end_time
        }
        console.log("INPUT CREATE TIMESLOT", time)
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
  })

  router.post('/planlist', function(req, res, next) {
    const planId = req.body.planId;
    console.log("reqbody planlist!!", req.body)

    getTimeslotsForPlan(db, planId)
    .then(timeslotsByPlan => {
      console.log("timeslots by plan return ", timeslotsByPlan)
      return res.send(timeslotsByPlan);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  router.post('/activities', function(req, res, next) {
    const actId = req.body.id;
    console.log("reqbody activities", req.body)

    getActivityById(db, actId)
    .then(activity => {
      console.log("activity by id return ", activity)
      return res.send(activity);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  router.post('/delete', function(req, res, next) {
    
    const timeslot = req.body.id
    console.log("timeslot put", timeslot);
    deleteTimeslot(db, timeslot)
    .then(deleted => {
      console.log("deleted return ", deleted)
      res.status(204).send("successfully delted!")
    })
    
  });

  router.post('/update', function(req, res, next) {
    const timeslotData = req.body
    console.log(timeslotData)
    console.log("timeslot update", timeslotData);
    updateTimeslot(db, timeslotData)
    .then(updated => {
      console.log("updated return ", updated)
      res.send(updated)
    })
    
  });

  router.post('/history', function(req, res, next) {
    const activityId = req.body.id
    console.log(activityId)
    console.log("timeslot update", activityId);
    getActivityById(db, activityId)
    .then(updated => {
      console.log("updated return ", updated)
      res.send(updated)
    })
    
  });

  

  return router;
  
};