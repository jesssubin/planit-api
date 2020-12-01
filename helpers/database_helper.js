const bcrypt = require('bcrypt');

//use bcrypt to hash password
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

//find a user from the cookie session
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

//create a new activity
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

//get favourites for a user
const myFavourites = function(db, userId) {
  let queryString = `
    SELECT activities.*, favourites.id as favourite_id
    FROM activities
    JOIN favourites ON activities.id = favourites.activity_id
    WHERE favourites.user_id = $1
    `;
  const values = [`${userId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows || []
  });
}
exports.myFavourites = myFavourites;

//find past adventures for user
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

//set a plan to not-active
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

//get activity details by id
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

//create a favourite in database for specific user
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

//create a plan for specific user
const createPlan = function(db, plan) {
  const queryString = `
  INSERT INTO plans (name, date, active, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const values = [plan.name, plan.date, 1, plan.userID]

  return db.query(queryString, values)
  .then(res => {
    if (res.rows.length){
      return res.rows;
    } else {
      return null;
    }
  });
}
exports.createPlan = createPlan;

//get all active plans for a user
const myPlans = function(db, userId) {
  let queryString = `
    SELECT plans.*
    FROM plans
    WHERE plans.user_id = $1
    `;
  const values = [`${userId}`];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.myPlans = myPlans;

//create a timeslot when user adds to plan
const createTimeslot = function(db, timeslot) {
  const queryString = `
  INSERT INTO time_slots (start_time, end_time, activity_id, plan_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
  const values = [timeslot.start_time, timeslot.end_time, timeslot.activity_id, timeslot.plan_id]

  return db.query(queryString, values)
  .then(res => {
    if (res.rows.length){
      return res.rows;
    } else {
      return null;
    }
  });
}
exports.createTimeslot = createTimeslot;

//get timeslots for specific plan
const myTimeslots = function(db, planID) {
  let queryString = `
    SELECT time_slots.*
    FROM time_slots
    WHERE time_slots.plan_id = $2
    `;
  return db.query(queryString, userID, planID)
  .then(res => {
    return res.rows
  });
}
exports.myTimeslots = myTimeslots;

//remove a favourite 
const removeFavourite = function(db, favouriteId) {
  const queryString = `
    DELETE FROM favourites 
    WHERE id = $1
    `;
  const values = [favouriteId]
  return db.query(queryString, values)
}
exports.removeFavourite = removeFavourite;

//delete timeslot from plan
const deleteTimeslot = function(db, timeslotId) {
  const queryString = `
    DELETE FROM time_slots 
    WHERE id = $1
    `;
 
  return db.query(queryString, [timeslotId])
  .then(res => {
    return res.rows
  });
}
exports.deleteTimeslot = deleteTimeslot;

//checks the active plans for the user
const myActivePlans = function(db, userId) {
  let queryString = `
    SELECT plans.*
    FROM plans
    WHERE user_id = $1
    AND active = 1
    `;
  const values = [userId];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.myActivePlans = myActivePlans;

//get timeslots for specific plan sorted by start time
const getTimeslotsForPlan = function(db, planId) {
  let queryString = `
  SELECT time_slots.*
  FROM time_slots
  WHERE plan_id = $1
  ORDER BY start_time ASC
  `;
const values = [planId];
return db.query(queryString, values)
.then(res => {
  return res.rows
});
}

exports.getTimeslotsForPlan = getTimeslotsForPlan

//find the activity details for specific Id 
const getActivityById = function(db, activityId) {
  let queryString = `
  SELECT activities.*
  FROM activities
  WHERE id = $1
  `;
  const values = [activityId];
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.getActivityById = getActivityById

//updates the time for a timeslot
const updateTimeslot = function(db, times) {
  let queryString = `
  UPDATE time_slots
  SET start_time = $1, end_time = $2
  WHERE id = $3
  `;
  const values = [times.start_time, times.end_time, times.id];
 
  return db.query(queryString, values)
  .then(res => {
    return res.rows
  });
}
exports.updateTimeslot = updateTimeslot