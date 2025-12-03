////////////////////////////////////////////////
// ============= PROFILE SERVICE ============ //
////////////////////////////////////////////////

// This service manages user profile retrieval and updates,
// interacting with the user model and handling data transformations.

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
// Updates user profile with provided data

const updateUserProfile = async (userId, profileData) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, (fetchErr, existingUser) => {
      if (fetchErr) return reject(fetchErr);
      if (!existingUser) return reject(new Error("User not found for update"));

      const mergedProfile = {
        user_firstname: profileData.firstName ?? existingUser.user_firstname,
        user_lastname: profileData.lastName ?? existingUser.user_lastname,
        user_email: profileData.email ?? existingUser.user_email,
        user_nickname: profileData.nickname ?? existingUser.user_nickname,
        user_avatar: profileData.avatar ?? existingUser.user_avatar,
        user_address: profileData.address ?? existingUser.user_address,
        user_address_line_2:
          profileData.addressLine2 ?? existingUser.user_address_line_2,
        user_city: profileData.city ?? existingUser.user_city,
        user_state: profileData.state ?? existingUser.user_state,
        user_zipcode: profileData.zipCode ?? existingUser.user_zipcode,
      };

      userModel.updateUser(userId, mergedProfile, (err, result) => {
        if (err) return reject(err);

        userModel.getUserById(userId, (fetchErr2, user) => {
          if (fetchErr2) return reject(fetchErr2);
          if (!user) return reject(new Error("User not found after update"));
          const userProfile = createUserProfile(user);
          resolve({ result, user: userProfile });
        });
      });
    });
  });
};

module.exports = { getUserProfile, updateUserProfile };
