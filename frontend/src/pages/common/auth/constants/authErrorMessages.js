///////////////////////////////////////////////
// ======= AUTH ERROR MESSAGES ============ //
///////////////////////////////////////////////

// Centralized error messages for authentication flows

///////////////////////////////////////
// ===== Authentication Errors ===== //
///////////////////////////////////////

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
  LOGIN_FAILED: "We couldn't log you in. Please try again.",
  LOGOUT_FAILED: "We couldn't log you out. Please try again.",
};

/////////////////////////////////////
// ===== Registration Errors ===== //
/////////////////////////////////////

export const REGISTRATION_ERRORS = {
  EMAIL_IN_USE: "This email is already registered. Please log in instead.",
  MISSING_FIELDS: "Please fill in all required fields.",
  REGISTRATION_FAILED: "We couldn't complete your registration. Please try again.",
  INVALID_RESPONSE: "Registration completed, but we couldn't load your profile. Please log in.",
};

////////////////////////////////
// ===== Profile Errors ===== //
////////////////////////////////

export const PROFILE_ERRORS = {
  FETCH_FAILED: "We couldn't load this profile. Please try again.",
  UPDATE_FAILED: "We couldn't save your changes. Please try again.",
  INVALID_PROFILE_ID: "This profile doesn't exist.",
};

//////////////////////////////////////////
// ===== Avatar Management Errors ===== //
//////////////////////////////////////////

export const AVATAR_ERRORS = {
  NO_FILE_SELECTED: "Please select an image file.",
  NO_USER_ID: "We couldn't identify your account. Please log in again.",
  UPLOAD_FAILED: "We couldn't upload your photo. Please try again.",
  DELETE_FAILED: "We couldn't remove your photo. Please try again.",
  FILE_TOO_LARGE: "Your image is too large. Please choose a file under 5MB.",
  INVALID_FILE_TYPE: "Please upload an image file (JPG, PNG, GIF, etc.).",
};

///////////////////////////////////////
// ===== Validation Errors ===== //
///////////////////////////////////////

export const VALIDATION_ERRORS = {
  FIRST_NAME_REQUIRED: "Please enter your first name.",
  LAST_NAME_REQUIRED: "Please enter your last name.",
  EMAIL_REQUIRED: "Please enter your email address.",
  EMAIL_INVALID: "Please enter a valid email address.",
  PASSWORD_REQUIRED: "Please enter a password.",
  PASSWORD_TOO_WEAK: "Your password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  PASSWORD_MISMATCH: "Your passwords don't match. Please try again.",
  NICKNAME_REQUIRED: "Please choose a nickname.",
};
