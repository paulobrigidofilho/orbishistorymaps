//////////////////////////////////////////////
// ====== SUCCESS MESSAGES CONSTANTS ====== //
//////////////////////////////////////////////

// Centralized success messages for consistency across controllers

////////////////////////////////////////
// ===== Authentication Success ===== //
////////////////////////////////////////

const AUTH_SUCCESS = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  SESSION_RESTORED: "Session restored successfully",
};

//////////////////////////////////////
// ===== Registration Success ===== //
//////////////////////////////////////

const REGISTRATION_SUCCESS = {
  USER_CREATED: "User registered successfully",
  ACCOUNT_CREATED: "Account created successfully",
};

/////////////////////////////////
// ===== Profile Success ===== //
/////////////////////////////////

const PROFILE_SUCCESS = {
  PROFILE_RETRIEVED: "Profile retrieved successfully",
  PROFILE_UPDATED: "Profile updated successfully",
};

///////////////////////////////////////////
// ===== Avatar Management Success ===== //
///////////////////////////////////////////

const AVATAR_SUCCESS = {
  AVATAR_UPLOADED: "Avatar uploaded successfully",
  AVATAR_DELETED: "Avatar deleted successfully",
  AVATAR_UPDATED: "Avatar updated successfully",
};

///////////////////////////////////////////
// ===== Password Reset Success ===== //
///////////////////////////////////////////

const PASSWORD_RESET_SUCCESS = {
  RESET_EMAIL_SENT: "Password reset email sent. Please check your inbox.",
  PASSWORD_UPDATED: "Password updated successfully. You can now login with your new password.",
};

module.exports = {
  AUTH_SUCCESS,
  REGISTRATION_SUCCESS,
  PROFILE_SUCCESS,
  AVATAR_SUCCESS,
  PASSWORD_RESET_SUCCESS,
};
