//////////////////////////////////////////////////
// ===== CREATE USER ASYNC HELPER ============= //
//////////////////////////////////////////////////

// This helper promisifies the callback-based userModel.createUser
// for use in async/await service functions.

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== createUserAsync Function ===== //
// Promisified wrapper around userModel.createUser

const createUserAsync = (userData) => {
  return new Promise((resolve, reject) => {
    userModel.createUser(userData, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { createUserAsync };
