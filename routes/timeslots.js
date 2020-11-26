const router = require("express").Router();
const { createActivity, myTimeslots, deleteTimeslot } = require('../helpers/database_helper'); 
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

  //create a new timeslot when user fills out form
  // router.post('/', function(req, res, next) {
    
  //   console.log("this is req.session: ", req.session)
  //   console.log("this is req.body: ", req.body)
  //   const { name, address, types } = req.body; //times hopefully also in here
  //   const activity = {name, address, types};
  //   const userId = req.session.userId;

  //   createActivity(db, activity)
  //   .then(activityRes => {
  //     const timeslotData = {activityID: activityRes.id, userID: userId} //add times
      
  //     createTimeslot(db, timeslotData)
  //     return res.send("timeslot created in database!")
  //     // if (!user) {
  //     //   return res.status(400).json({
  //     //     status: 'error',
  //     //     error: 'req body cannot be empty',
  //     //   });
  //     // }
  //     //return res.send(timeslot);
  //   })
  //   .catch(e => {
  //     return res.send(e)
  //   });
  // });

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