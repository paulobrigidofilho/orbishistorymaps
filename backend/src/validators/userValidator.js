/////////////////////////////////
// ===== USER VALIDATOR ===== //
/////////////////////////////////

// This validator aggregates all user-related validators
// to provide a unified interface for validation

// Import specialized validators from subdirectory
const registrationValidator = require('./userValidator/registrationValidator');
const loginValidator = require('./userValidator/loginValidator');
const profileValidator = require('./userValidator/profileValidator');

///////////////////////////////////////////////////////////////////////
// ======================= EXPORTED FUNCTIONS ====================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  // Registration validation
  validateRegistration: registrationValidator.validate,
  
  // Login validation
  validateLogin: loginValidator.validate,
  
  // Profile update validation
  validateProfileUpdate: profileValidator.validate
};
