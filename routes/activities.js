const router = require("express").Router();
const { createActivity } = require('../helpers/database_helper'); 

module.exports = db => {
  
  router.post('/', function(req, res, next) {
    //const { name, address, types } = req.body;
    console.log(req.body);
    const activities = req.body;

    createActivity(db, activities)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          status: 'error',
          error: 'req body cannot be empty',
        });
      }
      currentUser = user;
      req.session.userId = user.id;
      return res.send("activity saved!");
    })
    .catch(e => {
      return res.send(e)
    });
  });


  return router;
  
};