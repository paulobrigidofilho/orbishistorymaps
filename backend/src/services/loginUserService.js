////////////////////////////////////////////////////
// ============= LOGIN USER SERVICE ============= //
////////////////////////////////////////////////////

// This service handles the login logic for users
// including credential verification and profile retrieval.

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

// ======= Constants Imports ======= //
const { AUTH_ERRORS } = require("../constants/errorMessages");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== loginUser Function ===== //
// Authenticates user credentials and retrieves user profile

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  return new Promise((resolve, reject) => {
    userModel.getUserByEmail(email, async (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error(AUTH_ERRORS.INVALID_CREDENTIALS));

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          user.user_password
        );
        if (!passwordMatch)
          return reject(new Error(AUTH_ERRORS.INVALID_CREDENTIALS));
        const userProfile = createUserProfile(user);
        resolve(userProfile);
      } catch (compareError) {
        reject(compareError);
      }
    });
  });
};

module.exports = { loginUser };
