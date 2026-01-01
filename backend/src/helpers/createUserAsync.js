//////////////////////////////////////////////////
// ===== CREATE USER ASYNC HELPER ============= //
//////////////////////////////////////////////////

// This helper creates a user using the Sequelize User model
// for use in async/await service functions.

// ======= Model Imports ======= //
const { User } = require("../models");
const { v4: uuidv4 } = require("uuid");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== createUserAsync Function ===== //
// Creates a user using Sequelize User model

const createUserAsync = async (userData) => {
  try {
    const user = await User.create({
      user_id: userData.user_id || uuidv4(),
      user_firstname: userData.user_firstname,
      user_lastname: userData.user_lastname,
      user_email: userData.user_email,
      user_password: userData.user_password,
      user_nickname: userData.user_nickname || null,
      user_avatar: userData.user_avatar || null,
      user_address: userData.user_address || null,
      user_address_line_2: userData.user_address_line_2 || null,
      user_city: userData.user_city || null,
      user_state: userData.user_state || null,
      user_zipcode: userData.user_zipcode || null,
      user_role: userData.user_role || "user",
      user_status: userData.user_status || "active",
    });
    return { insertId: user.user_id };
  } catch (error) {
    throw error;
  }
};

module.exports = { createUserAsync };
