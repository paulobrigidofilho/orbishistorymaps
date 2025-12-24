////////////////////////////////////////////////
// ============= PROFILE SERVICE ============ //
////////////////////////////////////////////////

// This service manages user profile retrieval and updates,
// interacting with the user model and handling data transformations.

// ======= Module Imports ======= //
const db = require("../config/config").db;

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== getUserProfile Function ===== //
// Retrieves user profile by user ID

const getUserProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("Profile not found"));
      const userProfile = createUserProfile(user);
      resolve(userProfile);
    });
  });
};

// ===== updateUserProfile Function ===== //
// Updates user profile with provided data using dynamic SQL to ensure atomic updates

const updateUserProfile = async (userId, profileData) => {
  return new Promise((resolve, reject) => {
    // Map camelCase input fields to snake_case database columns
    const fieldMap = {
      firstName: "user_firstname",
      lastName: "user_lastname",
      email: "user_email",
      nickname: "user_nickname",
      avatar: "user_avatar",
      address: "user_address",
      addressLine2: "user_address_line_2",
      city: "user_city",
      state: "user_state",
      zipCode: "user_zipcode",
    };

    const updateFields = [];
    const updateValues = [];

    // Build dynamic UPDATE clause for only provided fields
    // Note: Empty strings are allowed to enable clearing optional fields
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && fieldMap[key]) {
        updateFields.push(`${fieldMap[key]} = ?`);
        updateValues.push(value);
      }
    });

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return reject(new Error("No fields to update"));
    }

    // Build and execute atomic UPDATE query
    const query = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE user_id = ?`;
    updateValues.push(userId);

    db.query(query, updateValues, (err, result) => {
      if (err) return reject(err);

      // Fetch updated profile
      userModel.getUserById(userId, (fetchErr, user) => {
        if (fetchErr) return reject(fetchErr);
        if (!user) return reject(new Error("User not found after update"));
        const userProfile = createUserProfile(user);
        resolve({ result, user: userProfile });
      });
    });
  });
};

module.exports = { getUserProfile, updateUserProfile };
