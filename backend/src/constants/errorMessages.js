///////////////////////////////////////////////
// ======= ERROR MESSAGES CONSTANTS ======= ///
///////////////////////////////////////////////

// Centralized error messages for consistency across controllers

///////////////////////////////////////
// ===== Authentication Errors ===== //
///////////////////////////////////////

const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  SESSION_INIT_ERROR: "Session middleware initialization failed",
  NO_ACTIVE_SESSION: "No active session found",
  LOGOUT_FAILED: "Session destruction failed",
};

/////////////////////////////////////
// ===== Registration Errors ===== //
/////////////////////////////////////

const REGISTRATION_ERRORS = {
  EMAIL_IN_USE: "Email address already registered",
  MISSING_FIELDS:
    "Required fields missing: firstName, lastName, email, password",
  REGISTRATION_FAILED: "User creation failed",
};

////////////////////////////////
// ===== Profile Errors ===== //
////////////////////////////////

const PROFILE_ERRORS = {
  PROFILE_NOT_FOUND: "User profile not found",
  USER_NOT_FOUND: "User account not found",
  NO_FIELDS_TO_UPDATE: "No update fields provided",
  UPDATE_FAILED: "Profile update operation failed",
};

//////////////////////////////////////////
// ===== Avatar Management Errors ===== //
//////////////////////////////////////////

const AVATAR_ERRORS = {
  NO_FILE_PROVIDED: "Avatar file missing from upload request",
  NO_USER_ID_PROVIDED: "User ID required for avatar operation",
  AVATAR_NOT_FOUND: "Avatar file not found on server",
  INVALID_FILENAME: "Filename contains invalid path characters",
  UPLOAD_FAILED: "Avatar file upload failed",
  DELETE_FAILED: "Avatar file deletion failed",
};

////////////////////////////////
// ===== Generic Errors ===== //
////////////////////////////////

const GENERIC_ERRORS = {
  SERVER_ERROR: "Internal server error occurred",
  INVALID_REQUEST: "Request validation failed",
};

///////////////////////////////////
// ===== Validation Errors ===== //
///////////////////////////////////

const VALIDATION_ERRORS = {
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email format",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_WEAK:
    "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  NICKNAME_REQUIRED: "Nickname is required",
  FILE_TOO_LARGE: "File size exceeds 5MB limit",
  INVALID_FILE_TYPE: "Only image files are allowed",
};

module.exports = {
  AUTH_ERRORS,
  REGISTRATION_ERRORS,
  PROFILE_ERRORS,
  AVATAR_ERRORS,
  GENERIC_ERRORS,
  VALIDATION_ERRORS,
};
