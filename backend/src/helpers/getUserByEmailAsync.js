////////////////////////////////////////////////
// ===== GET USER BY EMAIL ASYNC HELPER ===== //
////////////////////////////////////////////////

// This helper retrieves a user by email using the Sequelize User model
// for use in async/await service functions.

// ======= Model Imports ======= //
const { User } = require("../models");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== getUserByEmailAsync Function ===== //
// Retrieves a user by email using Sequelize User model

const getUserByEmailAsync = async (email) => {
  try {
    const user = await User.findOne({
      where: { user_email: email },
      raw: true,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserByEmailAsync };
