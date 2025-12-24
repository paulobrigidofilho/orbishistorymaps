///////////////////////////////////////
// ===== VALIDATION MIDDLEWARE ===== //
///////////////////////////////////////

// This middleware applies validation logic to requests
// before they reach the controller functions

// ===== Module Imports ===== //

const userValidator = require("../validators/userValidator");
const avatarValidator = require("../validators/avatarValidator");

// ===== Validation Middleware Functions ===== //
// This Middleware validates incoming request data
// for user registration, login, profile updates, and avatar uploads

// ===== validate Registration Data ===== //
const validateRegistration = (req, res, next) => {
  const validationResult = userValidator.validateRegistration(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: validationResult.error,
      errors: validationResult.errors,
    });
  }

  next();
};

// ===== validate Login Data ===== //
const validateLogin = (req, res, next) => {
  const validationResult = userValidator.validateLogin(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: validationResult.error,
      errors: validationResult.errors,
    });
  }

  next();
};

// ===== validate Avatar Upload ===== //
const validateAvatarUpload = (req, res, next) => {
  const validationResult = avatarValidator.validateAvatar(req.file);

  if (!validationResult.success) {
    return res.status(400).json({ message: validationResult.error });
  }

  next();
};

// ===== validate Profile Update Data ===== //
const validateProfileUpdate = (req, res, next) => {
  const validationResult = userValidator.validateProfileUpdate(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: validationResult.error,
      errors: validationResult.errors,
    });
  }

  next();
};

///////////////////////////////////////////////////////////////////////
// ========================= EXPORT MIDDLEWARE ===================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateAvatarUpload,
};
