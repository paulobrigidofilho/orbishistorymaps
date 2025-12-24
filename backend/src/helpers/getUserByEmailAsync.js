////////////////////////////////////////////////
// ===== GET USER BY EMAIL ASYNC HELPER ===== //
////////////////////////////////////////////////

// This helper promisifies the callback-based userModel.getUserByEmail
// for use in async/await service functions.

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== getUserByEmailAsync Function ===== //
// Promisified wrapper around userModel.getUserByEmail

const getUserByEmailAsync = (email) => {
  return new Promise((resolve, reject) => {
    userModel.getUserByEmail(email, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

module.exports = { getUserByEmailAsync };
