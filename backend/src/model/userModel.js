// ======= Module imports ======= //
const db = require("../config/config").db;

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
        user_id, user_firstname, user_lastname, user_email, user_password,
        user_nickname, user_avatar,
        user_address, user_address_line_2,
        user_city, user_state, user_zipcode
      FROM users
      WHERE user_email = ?`;
    db.query(query, [email], (err, results) => {
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
    console.log("createUser called with:", {
      ...userData,
      user_password: "[REDACTED]",
    });

    const query = `
    INSERT INTO users (
      user_id, user_firstname, user_lastname, user_email, user_password,
      user_nickname, user_avatar,
      user_address, user_address_line_2,
      user_city, user_state, user_zipcode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        userData.user_id,
        userData.user_firstname,
        userData.user_lastname,
        userData.user_email,
        userData.user_password,
        userData.user_nickname,
        userData.user_avatar,
        userData.user_address,
        userData.user_address_line_2,
        userData.user_city,
        userData.user_state,
        userData.user_zipcode,
      ],
      (err, result) => {
        if (err) {
          console.error("Database INSERT error:", err);
          return callback(err, null);
        }
        console.log("User inserted successfully. Result:", result);
        console.log("Inserted rows:", result.affectedRows);
        return callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= GET USER BY ID ======================== //
  ///////////////////////////////////////////////////////////////////////

  getUserById: (userId, callback) => {
    const query = `
    SELECT 
      user_id, user_firstname, user_lastname, user_email, user_password,
      user_nickname, user_avatar,
      user_address, user_address_line_2,
      user_city, user_state, user_zipcode
    FROM users 
    WHERE user_id = ?`;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      if (!results || results.length === 0) {
        return callback(null, null); // No user found
      }

      console.log("Database returned user:", results[0]);
      return callback(null, results[0]);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= UPDATE USER =========================== //
  ///////////////////////////////////////////////////////////////////////

  updateUser: (userId, userData, callback) => {
    // Accept both payload shapes: snake_case (service) and camelCase (legacy)
    const user_firstname = userData.user_firstname ?? userData.firstName;
    const user_lastname = userData.user_lastname ?? userData.lastName;
    const user_email = userData.user_email ?? userData.email;
    const user_nickname = userData.user_nickname ?? userData.nickname;
    const user_avatar = userData.user_avatar ?? userData.avatar;
    const user_address = userData.user_address ?? userData.address;
    const user_address_line_2 =
      userData.user_address_line_2 ?? userData.addressLine2;
    const user_city = userData.user_city ?? userData.city;
    const user_state = userData.user_state ?? userData.state;
    const user_zipcode = userData.user_zipcode ?? userData.zipCode;

    const query = `
      UPDATE users SET
        user_firstname = ?, user_lastname = ?, user_email = ?, user_nickname = ?,
        user_avatar = ?,
        user_address = ?, user_address_line_2 = ?, 
        user_city = ?, user_state = ?, user_zipcode = ?
      WHERE user_id = ?`;

    db.query(
      query,
      [
        user_firstname,
        user_lastname,
        user_email,
        user_nickname,
        user_avatar,
        user_address,
        user_address_line_2,
        user_city,
        user_state,
        user_zipcode,
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

  ///////////////////////////////////////////////////////////////////////
  // ===================== UPDATE PASSWORD =========================== //
  ///////////////////////////////////////////////////////////////////////

  updatePassword: (userId, hashedPassword, callback) => {
    const query = `
      UPDATE users 
      SET user_password = ?
      WHERE user_id = ?`;

    db.query(query, [hashedPassword, userId], (err, result) => {
      if (err) {
        console.error("Database error updating password:", err);
        return callback(err, null);
      }
      
      if (result.affectedRows === 0) {
        return callback(new Error("User not found"), null);
      }
      
      console.log("Password updated successfully for user:", userId);
      return callback(null, result);
    });
  },
};

module.exports = userModel;
