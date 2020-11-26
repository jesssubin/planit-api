const bcrypt = require('bcrypt');

const hashedPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};
exports.hashedPassword = hashedPassword;

//add user to database
const addUser = function(db, user) {
  const queryString = `
  INSERT INTO users (full_name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `
  return db.query(queryString, [user.full_name, user.email, user.password])
  .then(res => {
    if (res.rows.length){
      return res.rows[0];
    } else {
      return null;
    }
  });
}
exports.addUser = addUser;

//find a user by their email
const getUserWithEmail = function(db, email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;

  const queryParams = [email];

  return db.query(queryString, queryParams)
    .then(result => {
      if (result.rows === null) {
        return null;
      } else {
        return result.rows[0];
      }
    });
};
exports.getUserWithEmail = getUserWithEmail;

const userFromCookie = function(db, userId) {
  if (!userId) {
    return null;
  } else {
    const queryString = `SELECT * FROM users WHERE id = $1;`;
    const queryParams = [userId];

    return db.query(queryString, queryParams)
    .then (result => {
      if (result.rows === []) {
        return null;
      } else {
        return result.rows[0];
      }
    })
  }
};
exports.userFromCookie = userFromCookie;

const createActivity = function(db, activities) {
  const queryString = `
  INSERT INTO activities (name, address, types)
  VALUES ($1, $2, $3)
  RETURNING *
  `;

  return db.query(queryString, [activities.name, activities.address, activities.types])
  .then(res => {
    if (res.rows.length){
      return res.rows[0];
    } else {
      return null;
    }
  });
}
exports.createActivity = createActivity;

const myFavourites = function(db, userId) {
  let queryString = `
    SELECT activities.*
    FROM activities
    JOIN favourites ON activities.id = favourites.activity_id
    WHERE favourites.user_id = $1
    `;
  const values = [`${userId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.myFavourites = myFavourites;

const myActivePlans = function(db, userId) {
  let queryString = `
    SELECT plans.*
    FROM plans
    WHERE user_id = $1 AND active = 1; 
    `;
  const values = [`${userId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.myActivePlans = myActivePlans;

const myPreviousPlans = function(db, userId) {
  let queryString = `
    SELECT plans.*
    FROM plans
    WHERE user_id = $1 AND active != 1; 
    `;
  const values = [`${userId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.myPreviousPlans = myPreviousPlans;

const archivePlan = function(db, planId) {
  let queryString = `
    UPDATE plans
    SET active = active + 1
    WHERE id = $1; 
    `;
  const values = [planId];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.archivePlan = archivePlan;

const getActivities = function(db, activityId) {
  let queryString = `
    SELECT *
    FROM activities
    WHERE id = $1
    `;

  const values = [`${activityId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows[0]
  });
}
exports.getActivities = getActivities;

const createFavourites = function(db, favourite) {
  const queryString = `
  INSERT INTO favourites (is_favourite, user_id, activity_id)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const values = [1, favourite.userID, favourite.activityID]
  return db.query(queryString, values)
  .then(res => {
    if (res.rows.length){
      return res.rows;
    } else {
      return null;
    }
  });
}
exports.createFavourites = createFavourites;
