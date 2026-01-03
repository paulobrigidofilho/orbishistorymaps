///////////////////////////////////////////////////////////////////////
// ============= FADE NOTIFICATION CONSTANTS ========================= //
///////////////////////////////////////////////////////////////////////

// This file contains all constants used by FadeNotification component
// Centralizes configuration, defaults, and styling options

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default prop values for FadeNotification component
 */
export const FADE_NOTIFICATION_DEFAULTS = {
  type: "success",
  duration: 2000,
  fadeDuration: 500,
  position: "right",
};

///////////////////////////////////////////////////////////////////////
// =================== TYPE VARIANTS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Notification type options
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

///////////////////////////////////////////////////////////////////////
// =================== POSITION VARIANTS ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Notification position options
 */
export const NOTIFICATION_POSITIONS = {
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
};

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT ICONS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default Material Icons for each notification type
 */
export const DEFAULT_ICONS = {
  [NOTIFICATION_TYPES.SUCCESS]: "check_circle",
  [NOTIFICATION_TYPES.ERROR]: "error",
  [NOTIFICATION_TYPES.INFO]: "info",
};

///////////////////////////////////////////////////////////////////////
// =================== TIMING PRESETS ================================ //
///////////////////////////////////////////////////////////////////////

/**
 * Predefined timing configurations for different use cases
 */
export const TIMING_PRESETS = {
  QUICK: {
    duration: 1500,
    fadeDuration: 300,
  },
  STANDARD: {
    duration: 2000,
    fadeDuration: 500,
  },
  EXTENDED: {
    duration: 4000,
    fadeDuration: 500,
  },
  LONG: {
    duration: 6000,
    fadeDuration: 800,
  },
};

///////////////////////////////////////////////////////////////////////
// =================== COMMON MESSAGES =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Common notification messages used throughout the application
 */
export const COMMON_NOTIFICATION_MESSAGES = {
  // Cart messages
  ADDED_TO_CART: "Added to Cart!",
  REMOVED_FROM_CART: "Removed from Cart",
  CART_UPDATED: "Cart Updated",
  CART_CLEARED: "Cart Cleared",
  
  // Wishlist messages
  ADDED_TO_WISHLIST: "Added to Wishlist!",
  REMOVED_FROM_WISHLIST: "Removed from Wishlist",
  ALREADY_IN_WISHLIST: "Already in Wishlist",
  
  // Review messages
  REVIEW_SUBMITTED: "Review submitted successfully!",
  REVIEW_UPDATED: "Review updated successfully!",
  REVIEW_DELETED: "Review deleted successfully!",
  
  // General messages
  CHANGES_SAVED: "Changes saved successfully!",
  OPERATION_SUCCESSFUL: "Operation completed successfully!",
  OPERATION_FAILED: "Operation failed. Please try again.",
  
  // Error messages
  GENERIC_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
};
