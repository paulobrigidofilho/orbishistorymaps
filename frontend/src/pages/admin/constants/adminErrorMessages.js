///////////////////////////////////////////////////////////////////////
// ================= ADMIN ERROR MESSAGES ============================ //
///////////////////////////////////////////////////////////////////////

export const ERROR_MESSAGES = {
  // User errors
  FETCH_USERS_ERROR: "Error fetching users",
  FETCH_USER_ERROR: "Error fetching user",
  UPDATE_USER_STATUS_ERROR: "Failed to update user status",
  UPDATE_USER_ROLE_ERROR: "Failed to update user role",

  // Product errors
  FETCH_PRODUCTS_ERROR: "Error fetching products",
  FETCH_PRODUCT_ERROR: "Error fetching product",
  CREATE_PRODUCT_ERROR: "Failed to create product",
  UPDATE_PRODUCT_ERROR: "Failed to update product",
  DELETE_PRODUCT_ERROR: "Failed to delete product",
  UPLOAD_IMAGE_ERROR: "Failed to upload image",
  DELETE_IMAGE_ERROR: "Failed to delete image",

  // Order errors
  FETCH_ORDERS_ERROR: "Error fetching orders",
  FETCH_ORDER_ERROR: "Error fetching order",
  UPDATE_ORDER_ERROR: "Failed to update order",

  // Settings errors
  FETCH_SETTINGS_ERROR: "Failed to fetch settings",
  SAVE_SETTINGS_ERROR: "Failed to save settings",

  // Stats errors
  FETCH_STATS_ERROR: "Error fetching admin stats",

  // General errors
  UNAUTHORIZED: "You need admin privileges to access this page",
  NETWORK_ERROR: "Network error. Please check your connection",
  UNKNOWN_ERROR: "An unexpected error occurred",
};
