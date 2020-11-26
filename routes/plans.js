const router = require("express").Router();
const { myActivePlans, myPreviousPlans } = require('../helpers/database_helper'); 
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

  router.get('/history', function(req, res, next) {
    const userId = req.session.userId;
    myPreviousPlans(db, userId)
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

  return router;
  
};