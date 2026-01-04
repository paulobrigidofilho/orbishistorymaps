///////////////////////////////////////////////////////////////////////
// ================ PROFILE SERVICE (SEQUELIZE) ==================== //
///////////////////////////////////////////////////////////////////////

// This service manages user profile retrieval and updates
// using Sequelize ORM for database operations

// ======= Model Imports ======= //
const { User } = require("../models");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== getUserProfile Function ===== //
// Retrieves user profile by user ID

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("Profile not found");
  }

  const userProfile = createUserProfile(user.toJSON());
  return userProfile;
};

// ===== updateUserProfile Function ===== //
// Updates user profile with provided data using Sequelize

const updateUserProfile = async (userId, profileData) => {
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
    country: "user_country",
  };

  const updateData = {};

  // Build update object for only provided fields
  // Note: Empty strings are allowed to enable clearing optional fields
  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== undefined && fieldMap[key]) {
      updateData[fieldMap[key]] = value;
    }
  });

  // If no fields to update, return early
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  // Find and update user
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.update(updateData);

  // Return updated profile
  const userProfile = createUserProfile(user.toJSON());
  return { result: { affectedRows: 1 }, user: userProfile };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = { getUserProfile, updateUserProfile };
