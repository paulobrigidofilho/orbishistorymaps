//////////////////////////////////////////////
// ===== GET USER BY ID ASYNC HELPER ====== //
//////////////////////////////////////////////

// This helper retrieves a user by ID using the Sequelize User model
// for use in async/await service functions.

// ======= Model Imports ======= //
const { User } = require("../models");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== getUserByIdAsync Function ===== //
// Retrieves a user by ID using Sequelize User model

const getUserByIdAsync = async (userId) => {
  try {
    const user = await User.findByPk(userId, { raw: true });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserByIdAsync };
