///////////////////////////////////////////////////////////////////////
// ================ ALERT MODAL CONSTANTS ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains all constants used by AlertModal component
// Centralizes configuration, defaults, messages, and styling

///////////////////////////////////////////////////////////////////////
// =================== MODAL TYPES =================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert modal type variants
 */
export const ALERT_MODAL_TYPES = {
  CONFIRM: "confirm",
  ALERT: "alert",
  WARNING: "warning",
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default prop values for AlertModal component
 */
export const ALERT_MODAL_DEFAULTS = {
  type: ALERT_MODAL_TYPES.CONFIRM,
  title: "Confirm Action",
  message: "Are you sure you want to proceed?",
  confirmText: "OK",
  cancelText: "Cancel",
  showCancel: true,
  icon: "help_outline",
};

///////////////////////////////////////////////////////////////////////
// =================== ICON MAPPING ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Default icons for each modal type
 */
export const ALERT_MODAL_ICONS = {
  [ALERT_MODAL_TYPES.CONFIRM]: "help_outline",
  [ALERT_MODAL_TYPES.ALERT]: "info",
  [ALERT_MODAL_TYPES.WARNING]: "warning",
  [ALERT_MODAL_TYPES.SUCCESS]: "check_circle",
  [ALERT_MODAL_TYPES.ERROR]: "error",
  [ALERT_MODAL_TYPES.INFO]: "info_outline",
};

///////////////////////////////////////////////////////////////////////
// =================== COLOR MAPPING ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Colors for each modal type
 */
export const ALERT_MODAL_COLORS = {
  [ALERT_MODAL_TYPES.CONFIRM]: "#3498db",
  [ALERT_MODAL_TYPES.ALERT]: "#3498db",
  [ALERT_MODAL_TYPES.WARNING]: "#f39c12",
  [ALERT_MODAL_TYPES.SUCCESS]: "#27ae60",
  [ALERT_MODAL_TYPES.ERROR]: "#e74c3c",
  [ALERT_MODAL_TYPES.INFO]: "#3498db",
};

///////////////////////////////////////////////////////////////////////
// =================== CART MESSAGES ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for cart operations
 */
export const CART_ALERT_MESSAGES = {
  REMOVE_ITEM: {
    title: "Remove Item",
    message: "Remove this item from cart?",
    confirmText: "Remove",
    cancelText: "Cancel",
    type: ALERT_MODAL_TYPES.CONFIRM,
    icon: "remove_shopping_cart",
  },
  CLEAR_CART: {
    title: "Clear Cart",
    message: "Clear all items from cart?",
    confirmText: "Clear All",
    cancelText: "Cancel",
    type: ALERT_MODAL_TYPES.WARNING,
    icon: "remove_shopping_cart",
  },
  ITEM_REMOVED: {
    title: "Item Removed",
    message: "Item has been removed from your cart.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  CART_CLEARED: {
    title: "Cart Cleared",
    message: "All items have been removed from your cart.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== REVIEW MESSAGES =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for review operations
 */
export const REVIEW_ALERT_MESSAGES = {
  DELETE_REVIEW: {
    title: "Delete Review",
    message: "Are you sure you want to delete this review? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ALERT_MODAL_TYPES.WARNING,
    icon: "delete",
  },
  REVIEW_DELETED: {
    title: "Review Deleted",
    message: "Your review has been deleted.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  DELETE_FAILED: {
    title: "Delete Failed",
    message: "Failed to delete review. Please try again.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.ERROR,
    icon: "error",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== GENERAL ERROR MESSAGES ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * General error alert configurations
 */
export const ERROR_ALERT_MESSAGES = {
  GENERIC_ERROR: {
    title: "Error",
    message: "Something went wrong. Please try again.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.ERROR,
    icon: "error",
  },
  NETWORK_ERROR: {
    title: "Network Error",
    message: "Unable to connect to the server. Please check your connection.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.ERROR,
    icon: "wifi_off",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== SUCCESS MESSAGES ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * General success alert configurations
 */
export const SUCCESS_ALERT_MESSAGES = {
  OPERATION_SUCCESS: {
    title: "Success",
    message: "Operation completed successfully.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  CHANGES_SAVED: {
    title: "Saved",
    message: "Your changes have been saved.",
    confirmText: "OK",
    showCancel: false,
    type: ALERT_MODAL_TYPES.SUCCESS,
    icon: "save",
  },
};
