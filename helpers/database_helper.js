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
  const queryString = `SELECT * FROM users
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
