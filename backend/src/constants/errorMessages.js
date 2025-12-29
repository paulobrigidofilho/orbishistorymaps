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
  FILE_TOO_LARGE: "File size exceeds 3MB limit",
  INVALID_FILE_TYPE: "Only image files are allowed",
};

///////////////////////////////////////
// ===== Password Reset Errors ===== //
///////////////////////////////////////

const PASSWORD_RESET_ERRORS = {
  EMAIL_NOT_FOUND: "No account found with this email address",
  EMAIL_REQUIRED: "Email is required",
  TOKEN_GENERATION_FAILED: "Failed to generate reset token",
  INVALID_TOKEN: "Invalid reset token",
  INVALID_OR_EXPIRED_TOKEN: "Reset token is invalid or has expired",
  PASSWORD_UPDATE_FAILED: "Failed to update password",
  MISSING_FIELDS: "Token and password are required",
};

////////////////////////////////
// ===== Product Errors ===== //
////////////////////////////////

const PRODUCT_ERRORS = {
  NOT_FOUND: "Product not found",
  FETCH_FAILED: "Failed to fetch products",
  CREATE_FAILED: "Failed to create product",
  UPDATE_FAILED: "Failed to update product",
  DELETE_FAILED: "Failed to delete product",
  OUT_OF_STOCK: "Product is out of stock",
  INSUFFICIENT_STOCK: "Insufficient stock available",
};

/////////////////////////////
// ===== Cart Errors ===== //
/////////////////////////////

const CART_ERRORS = {
  FETCH_FAILED: "Failed to fetch cart",
  ADD_FAILED: "Failed to add item to cart",
  UPDATE_FAILED: "Failed to update cart item",
  REMOVE_FAILED: "Failed to remove item from cart",
  CLEAR_FAILED: "Failed to clear cart",
  MERGE_FAILED: "Failed to merge cart",
  ITEM_NOT_FOUND: "Cart item not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_UNAVAILABLE: "Product is not available",
  INVALID_QUANTITY: "Quantity must be at least 1",
};

//////////////////////////////
// ===== Order Errors ===== //
//////////////////////////////

const ORDER_ERRORS = {
  CREATE_FAILED: "Failed to create order",
  FETCH_FAILED: "Failed to fetch order",
  UPDATE_FAILED: "Failed to update order",
  NOT_FOUND: "Order not found",
  EMPTY_CART: "Cannot create order from empty cart",
  LOGIN_REQUIRED: "You must be logged in to place an order",
  INVALID_ADDRESS: "Invalid shipping or billing address",
  PAYMENT_FAILED: "Payment processing failed",
};

//////////////////////////////////
// ===== Wishlist Errors ===== //
//////////////////////////////////

const WISHLIST_ERRORS = {
  FETCH_FAILED: "Failed to fetch wishlist",
  ADD_FAILED: "Failed to add item to wishlist",
  REMOVE_FAILED: "Failed to remove item from wishlist",
  ITEM_NOT_FOUND: "Item not found in wishlist",
  PRODUCT_NOT_FOUND: "Product not found",
  ALREADY_EXISTS: "Item already exists in wishlist",
};

module.exports = {
  AUTH_ERRORS,
  REGISTRATION_ERRORS,
  PROFILE_ERRORS,
  AVATAR_ERRORS,
  GENERIC_ERRORS,
  VALIDATION_ERRORS,
  PASSWORD_RESET_ERRORS,
  PRODUCT_ERRORS,
  CART_ERRORS,
  WISHLIST_ERRORS,
  ORDER_ERRORS,
};
