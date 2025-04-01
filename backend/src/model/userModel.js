// ======= Module imports ======= //

const userDB = require('../db/userDB.js');

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
    const { firstName, lastName, email, password, nickname, avatar, address, city, zipCode } = userData;
    const query = 'INSERT INTO users (USER_FIRSTNAME, USER_LASTNAME, USER_EMAIL, USER_PASSWORD, USER_NICKNAME, USER_AVATAR, USER_ADDRESS, USER_CITY, USER_ZIPCODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    userDB.query(query, [firstName, lastName, email, password, nickname, avatar, address, city, zipCode], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
};

module.exports = userModel;