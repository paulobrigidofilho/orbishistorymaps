// ======= Module imports ======= //
const userDB = require('../db/userDB');

///////////////////////////////////////////////////////////////////////
// ========================= USER MODEL ============================ //
///////////////////////////////////////////////////////////////////////

const userModel = {

  ///////////////////////////////////////////////////////////////////////
  // ========================= GET USER BY EMAIL ===================== //
  ///////////////////////////////////////////////////////////////////////

  getUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE USER_EMAIL = ?';
    userDB.query(query, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, results[0]); // Return the first user found (if any)
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= CREATE USER =========================== //
  ///////////////////////////////////////////////////////////////////////

  createUser: (userData, callback) => {
    const { USER_ID, firstName, lastName, email, password, nickname, avatar, address, city, zipCode } = userData;
    const query = 'INSERT INTO users (USER_ID, USER_FIRSTNAME, USER_LASTNAME, USER_EMAIL, USER_PASSWORD, USER_NICKNAME, USER_AVATAR, USER_ADDRESS, USER_CITY, USER_ZIPCODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    userDB.query(query, [USER_ID, firstName, lastName, email, password, nickname, avatar, address, city, zipCode], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= GET USER BY ID ========================= //
  ///////////////////////////////////////////////////////////////////////

  getUserById: (userId, callback) => {
    const query = 'SELECT * FROM users WHERE USER_ID = ?';
    userDB.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }

      console.log('Database results:', results); // <---- ADD THIS LINE
      return callback(null, results[0]); // Return the first user found (if any)
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= UPDATE USER =========================== //
  ///////////////////////////////////////////////////////////////////////

  updateUser: (userId, userData, callback) => {
    const { firstName, lastName, email, nickname, avatar, address, city, zipCode } = userData;
    const query = 'UPDATE users SET USER_FIRSTNAME = ?, USER_LASTNAME = ?, USER_EMAIL = ?, USER_NICKNAME = ?, USER_AVATAR = ?, USER_ADDRESS = ?, USER_CITY = ?, USER_ZIPCODE = ? WHERE USER_ID = ?';
    userDB.query(query, [firstName, lastName, email, nickname, avatar, address, city, zipCode, userId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
};

module.exports = userModel;