const db = require('./db'); // Import the database connection from db.js

const userModel = {
  getUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE USER_EMAIL = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, results[0]); // Return the first user found (if any)
    });
  },

  createUser: (userData, callback) => {
    const { firstName, lastName, email, password, nickname, avatar, address, city, zipCode } = userData;
    const query = 'INSERT INTO users (USER_FIRSTNAME, USER_LASTNAME, USER_EMAIL, USER_PASSWORD, USER_NICKNAME, USER_AVATAR, USER_ADDRESS, USER_CITY, USER_ZIPCODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, password, nickname, avatar, address, city, zipCode], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
};

module.exports = userModel;