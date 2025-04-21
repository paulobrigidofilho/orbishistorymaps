// ======= Module imports ======= //
const userDB = require("../db/userDB");

///////////////////////////////////////////////////////////////////////
// ========================= USER MODEL ============================ //
///////////////////////////////////////////////////////////////////////

const userModel = {
  ///////////////////////////////////////////////////////////////////////
  // ========================= GET USER BY EMAIL ===================== //
  ///////////////////////////////////////////////////////////////////////

  getUserByEmail: (email, callback) => {
    const query = `
      SELECT
        USER_ID, USER_FIRSTNAME, USER_LASTNAME, USER_EMAIL, USER_PASSWORD,
        USER_NICKNAME, USER_AVATAR,
        USER_ADDRESS, USER_ADDRESS_LINE_2,
        USER_CITY, USER_STATE, USER_ZIPCODE
      FROM users
      WHERE USER_EMAIL = ?`;
    userDB.query(query, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      return callback(null, results[0]); // Return the first user found (if any)
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= CREATE USER =========================== //
  ///////////////////////////////////////////////////////////////////////

  createUser: (userData, callback) => {
    console.log("createUser called with:", userData);
  
    const query = `
    INSERT INTO users (
      USER_ID, USER_FIRSTNAME, USER_LASTNAME, USER_EMAIL, USER_PASSWORD,
      USER_NICKNAME, USER_AVATAR,
      USER_ADDRESS, USER_ADDRESS_LINE_2,  -- Combined street/number into USER_ADDRESS
      USER_CITY, USER_STATE, USER_ZIPCODE
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    userDB.query(
      query,
      [
        userData.USER_ID,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.nickname,
        userData.avatar,
        userData.address,      
        userData.addressLine2,   
        userData.city,         
        userData.state,       
        userData.zipCode,       
      ],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return callback(err, null);
        }
        return callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= GET USER BY ID ======================== //
  ///////////////////////////////////////////////////////////////////////

  getUserById: (userId, callback) => {
    const query = "SELECT * FROM users WHERE USER_ID = ?";
    userDB.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      return callback(null, results[0]);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= UPDATE USER =========================== //
  ///////////////////////////////////////////////////////////////////////

  updateUser: (userId, userData, callback) => {
    const {
      firstName,
      lastName,
      email,
      nickname,
      avatar,
      address,    
      addressLine2,    
      city,
      state,
      zipCode,
    } = userData;

    const query = `
      UPDATE users SET
        USER_FIRSTNAME = ?, USER_LASTNAME = ?, USER_EMAIL = ?, USER_NICKNAME = ?,
        USER_AVATAR = ?,
        USER_ADDRESS = ?, USER_ADDRESS_LINE_2 = ?, 
        USER_CITY = ?, USER_STATE = ?, USER_ZIPCODE = ?
      WHERE USER_ID = ?`;
    userDB.query(
      query,
      [
        firstName,
        lastName,
        email,
        nickname,
        avatar,
        address,
        addressLine2,
        city,
        state,
        zipCode,
        userId,
      ],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return callback(err, null);
        }
        return callback(null, result);
      }
    );
  },
};

module.exports = userModel;
