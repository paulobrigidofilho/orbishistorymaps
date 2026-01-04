///////////////////////////////////////////////////////////////////////
// ================= LOGIN USER SERVICE (SEQUELIZE) ================ //
///////////////////////////////////////////////////////////////////////

// This service handles the login logic for users
// including credential verification and profile retrieval.

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");

// ======= Model Imports ======= //
const { User } = require("../models");

// ======= Constants Imports ======= //
const { AUTH_ERRORS } = require("../constants/errorMessages");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== loginUser Function ===== //
// Authenticates user credentials and retrieves user profile

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  try {
    // Find user by email
    const user = await User.findOne({
      where: { user_email: email },
    });

    if (!user) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.user_password);
    if (!passwordMatch) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    // Create user profile from Sequelize model
    const userProfile = createUserProfile(user.toJSON());
    return userProfile;
  } catch (error) {
    if (error.message === AUTH_ERRORS.INVALID_CREDENTIALS) {
      throw error;
    }
    console.error("Login error:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = { loginUser };
