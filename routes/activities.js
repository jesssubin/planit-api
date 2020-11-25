const router = require("express").Router();
const { createActivity, createFavourites } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {
  
  router.post('/', function(req, res, next) {
    //const { name, address, types } = req.body;
    console.log("this is req.session: ", req.session)
    const activities = req.body;
    const userId = req.session.userId;

    createActivity(db, activities)
    .then(activity => {
      const favourite = {activityID: activity.id, userID: userId}
      
      createFavourites(db, favourite)

      // console.log("reqbody: ", req.body) <-- activity without id
      // console.log("activity: ", activity) <-- activity with id
      
      if (!user) {
        return res.status(400).json({
          status: 'error',
          error: 'req body cannot be empty',
        });
      }
      return res.send(activity);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  return router;
  
};