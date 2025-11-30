/////////////////////////////////////////
// ===== VALIDATION MIDDLEWARE ===== //
/////////////////////////////////////////

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
  const validation = userValidator.validateRegistration(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      error: validation.error,
      errors: validation.errors,
    });
  }

  next();
};

// ===== validate Login Data ===== //
const validateLogin = (req, res, next) => {
  const validation = userValidator.validateLogin(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      error: validation.error,
      errors: validation.errors,
    });
  }

  next();
};

// ===== validate Profile Update Data ===== //
const validateProfileUpdate = (req, res, next) => {
  const validation = userValidator.validateProfileUpdate(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      error: validation.error,
      errors: validation.errors,
    });
  }

  next();
};

// ===== validate Avatar Upload ===== //
const validateAvatarUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const validation = avatarValidator.validateAvatar(req.file);

  if (!validation.success) {
    return res.status(400).json({
      message: "Avatar validation failed",
      error: validation.error,
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
