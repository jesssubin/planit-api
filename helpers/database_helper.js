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

//is it easier to delete fav or update and %2 to determine whether it is still fav ??  
const removeFavourite = function(db, userID, activityID) {
  const queryString = `
    DELETE FROM favourites 
    WHERE user_id = $1 AND activity_id = $2
    `;
  const values = [favourite.userID, favourite.activityID]
  return db.query(queryString, values)
  .then(res => {
    if (res.rows.length){
      return res.rows;
    } else {
      return null;
    }
  });
}
exports.removeFavourite = removeFavourite;

const deleteTimeslot = function(db, userID, timeslotID) {
  const queryString = `
    DELETE FROM time_slots 
    WHERE user_id = $1 AND id = $2 
    `;
  const values = [userID, timeslotID]

  return db.query(queryString, values)
  .then(res => {
    if (res.rows.length){
      return res.rows;
    } else {
      return null;
    }
  });
}
exports.deleteTimeslot = deleteTimeslot;

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
const values = [userId];
return db.query(queryString, values)
.then(res => {
  return res.rows
});
}

exports.getTimeslotsForPlan = getTimeslotsForPlan