/////////////////////////////////////////
// ===== VALIDATION MIDDLEWARE ===== //
/////////////////////////////////////////

// This middleware applies validation logic to requests
// before they reach the controller functions

const userValidator = require('../validators/userValidator');
const avatarValidator = require('../validators/avatarValidator');

///////////////////////////////////////////////////////////////////////
// ========================= MIDDLEWARE FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Middleware to validate registration data
 */
const validateRegistration = (req, res, next) => {
  const validation = userValidator.validateRegistration(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      error: validation.error,
      errors: validation.errors
    });
  }
  
  next();
};

/**
 * Middleware to validate login data
 */
const validateLogin = (req, res, next) => {
  const validation = userValidator.validateLogin(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      error: validation.error,
      errors: validation.errors
    });
  }
  
  next();
};

/**
 * Middleware to validate profile update data
 */
const validateProfileUpdate = (req, res, next) => {
  const validation = userValidator.validateProfileUpdate(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      message: 'Validation failed',
      error: validation.error,
      errors: validation.errors
    });
  }
  
  next();
};

/**
 * Middleware to validate avatar upload
 */
const validateAvatarUpload = (req, res, next) => {
  // Skip validation if no file is uploaded
  if (!req.file) {
    return next();
  }
  
  const validation = avatarValidator.validateAvatar(req.file);
  
  if (!validation.success) {
    return res.status(400).json({
      message: 'Avatar validation failed',
      error: validation.error
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
  validateAvatarUpload
};
