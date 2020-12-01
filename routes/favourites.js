const router = require("express").Router();
const { myFavourites, removeFavourite } = require('../helpers/database_helper'); 
const cookieSession = require('cookie-session');

module.exports = db => {
  
  router.get('/', function(req, res, next) {
  
    const userId = req.session.userId;

    myFavourites(db, userId)
    .then(favourites => {
      return res.send(favourites);
    })
    .catch(e => {
      return res.send(e)
    });
  });

  // delete a favourite or update it??
  router.post('/', function(req, res, next) {
 
      const favouriteId = req.body.id

      removeFavourite(db, favouriteId) 
      .then( () => {
        res.status(204).send("successfully delted!")
      })
    .catch(e => {
      return res.send(e)
    });
  })

  return router;
  
};