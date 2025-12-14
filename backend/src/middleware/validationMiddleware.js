const {
  VALIDATION_ERRORS,
  AVATAR_ERRORS,
} = require("../constants/errorMessages");
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
  const { firstName, lastName, email, password, nickname } = req.body;

  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ message: "First name is required" });
  }

  if (!lastName || !lastName.trim()) {
    return res.status(400).json({ message: "Last name is required" });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || !password.trim()) {
    return res
      .status(400)
      .json({ message: VALIDATION_ERRORS.PASSWORD_REQUIRED });
  }

  // Password minimum length (8 characters to match frontend)
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  // Strong password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({ message: VALIDATION_ERRORS.PASSWORD_TOO_WEAK });
  }

  if (!nickname || !nickname.trim()) {
    return res.status(400).json({ message: "Nickname is required" });
  }

  next();
};

// ===== validate Login Data ===== //
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password || !password.trim()) {
    return res.status(400).json({ message: "Password is required" });
  }

  next();
};

// ===== validate Avatar Upload ===== //
const validateAvatarUpload = (req, res, next) => {
  // Avatar is optional, skip if no file
  if (!req.file) {
    return next();
  }

  // File size limit: 5MB (matches multer config and frontend)
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ message: "File size exceeds 5MB limit" });
  }

  // File type check: must be image
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Only image files are allowed" });
  }

  next();
};

// ===== validate Profile Update Data ===== //
const validateProfileUpdate = (req, res, next) => {
  const { email } = req.body;

  // If email is provided, validate format
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
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
