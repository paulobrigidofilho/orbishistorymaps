//////////////////////////////////////////////
// ===== GET USER BY ID ASYNC HELPER ====== //
//////////////////////////////////////////////

// This helper promisifies the callback-based userModel.getUserById
// for use in async/await service functions.

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

///////////////////////////////////
// ===== HELPER FUNCTION ======= //
///////////////////////////////////

// ===== getUserByIdAsync Function ===== //
// Promisified wrapper around userModel.getUserById

const getUserByIdAsync = (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

module.exports = { getUserByIdAsync };
