///////////////////////////////////////////////
// ======= ADMIN MESSAGES CONSTANTS ======= ///
///////////////////////////////////////////////

// Centralized admin-specific messages

///////////////////////////////////////
// ===== Admin Error Messages ===== //
///////////////////////////////////////

const ADMIN_ERRORS = {
  // User Management
  USER_NOT_FOUND: "User not found",
  INVALID_USER_ID: "Invalid user ID provided",
  CANNOT_MODIFY_OWN_ROLE: "Cannot modify your own admin role",
  CANNOT_MODIFY_OWN_STATUS: "Cannot modify your own account status",
  INVALID_STATUS: "Invalid status value. Must be: active, inactive, or suspended",
  INVALID_ROLE: "Invalid role value. Must be: user or admin",
  USER_UPDATE_FAILED: "Failed to update user",
  
  // Product Management
  PRODUCT_NOT_FOUND: "Product not found",
  INVALID_PRODUCT_ID: "Invalid product ID provided",
  PRODUCT_CREATE_FAILED: "Failed to create product",
  PRODUCT_UPDATE_FAILED: "Failed to update product",
  PRODUCT_DELETE_FAILED: "Failed to delete product",
  DUPLICATE_SKU: "Product SKU already exists",
  INVALID_CATEGORY: "Invalid category ID provided",
  
  // Image Management
  NO_IMAGE_PROVIDED: "No image file provided",
  IMAGE_REQUIRED: "Image file is required",
  INVALID_IMAGE_FORMAT: "Invalid image format. Allowed: jpg, jpeg, png, webp",
  IMAGE_UPLOAD_FAILED: "Image upload failed",
  IMAGE_DELETE_FAILED: "Image deletion failed",
  IMAGE_NOT_FOUND: "Image not found",
  
  // General
  UNAUTHORIZED: "Admin privileges required",
  FORBIDDEN: "Access denied",
};

/////////////////////////////////////////
// ===== Admin Success Messages ===== //
/////////////////////////////////////////

const ADMIN_SUCCESS = {
  // User Management
  USER_STATUS_UPDATED: "User status updated successfully",
  USER_ROLE_UPDATED: "User role updated successfully",
  USER_RETRIEVED: "User retrieved successfully",
  USERS_RETRIEVED: "Users retrieved successfully",
  
  // Product Management
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCT_RETRIEVED: "Product retrieved successfully",
  PRODUCTS_RETRIEVED: "Products retrieved successfully",
  
  // Image Management
  IMAGE_UPLOADED: "Product image uploaded successfully",
  IMAGE_DELETED: "Product image deleted successfully",
  PRIMARY_IMAGE_SET: "Primary image set successfully",
};

module.exports = {
  ADMIN_ERRORS,
  ADMIN_SUCCESS,
};
