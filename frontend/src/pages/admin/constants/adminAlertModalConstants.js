///////////////////////////////////////////////////////////////////////
// ============== ADMIN ALERT MODAL CONSTANTS ======================== //
///////////////////////////////////////////////////////////////////////

// This file contains all constants used by AdminAlertModal component
// Centralizes configuration, defaults, messages for ADMIN operations only

///////////////////////////////////////////////////////////////////////
// =================== MODAL TYPES =================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Admin alert modal type variants
 */
export const ADMIN_ALERT_MODAL_TYPES = {
  CONFIRM: "confirm",
  ALERT: "alert",
  WARNING: "warning",
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  DANGER: "danger",
};

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default prop values for AdminAlertModal component
 */
export const ADMIN_ALERT_MODAL_DEFAULTS = {
  type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
  title: "Confirm Action",
  message: "Are you sure you want to proceed?",
  confirmText: "Confirm",
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
export const ADMIN_ALERT_MODAL_ICONS = {
  [ADMIN_ALERT_MODAL_TYPES.CONFIRM]: "help_outline",
  [ADMIN_ALERT_MODAL_TYPES.ALERT]: "info",
  [ADMIN_ALERT_MODAL_TYPES.WARNING]: "warning_amber",
  [ADMIN_ALERT_MODAL_TYPES.SUCCESS]: "check_circle",
  [ADMIN_ALERT_MODAL_TYPES.ERROR]: "error",
  [ADMIN_ALERT_MODAL_TYPES.INFO]: "info_outline",
  [ADMIN_ALERT_MODAL_TYPES.DANGER]: "dangerous",
};

///////////////////////////////////////////////////////////////////////
// =================== COLOR MAPPING ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Colors for each admin modal type
 */
export const ADMIN_ALERT_MODAL_COLORS = {
  [ADMIN_ALERT_MODAL_TYPES.CONFIRM]: "#3498db",
  [ADMIN_ALERT_MODAL_TYPES.ALERT]: "#3498db",
  [ADMIN_ALERT_MODAL_TYPES.WARNING]: "#f39c12",
  [ADMIN_ALERT_MODAL_TYPES.SUCCESS]: "#27ae60",
  [ADMIN_ALERT_MODAL_TYPES.ERROR]: "#e74c3c",
  [ADMIN_ALERT_MODAL_TYPES.INFO]: "#3498db",
  [ADMIN_ALERT_MODAL_TYPES.DANGER]: "#c0392b",
};

///////////////////////////////////////////////////////////////////////
// =================== USER MANAGEMENT MESSAGES ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for admin user management
 */
export const ADMIN_USER_ALERT_MESSAGES = {
  CHANGE_STATUS: (newStatus) => ({
    title: "Change User Status",
    message: `Change user status to ${newStatus}?`,
    confirmText: "Change Status",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: "person",
  }),
  CHANGE_ROLE: (newRole) => ({
    title: "Change User Role",
    message: `Change user role to ${newRole}?`,
    confirmText: "Change Role",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: "admin_panel_settings",
  }),
  DELETE_USER: {
    title: "Delete User",
    message: "Are you sure you want to delete this user? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.DANGER,
    icon: "person_remove",
  },
  ADMIN_DELETE_BLOCKED: {
    title: "Action Blocked",
    message: "Admin accounts cannot be deleted.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.WARNING,
    icon: "block",
  },
  USER_DELETED: {
    title: "User Deleted",
    message: "User has been successfully deleted.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== PRODUCT MANAGEMENT MESSAGES =================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for admin product management
 */
export const ADMIN_PRODUCT_ALERT_MESSAGES = {
  CHANGE_STATUS: (newStatus) => ({
    title: "Change Product Status",
    message: `Change product status to ${newStatus ? "Active" : "Inactive"}?`,
    confirmText: "Change Status",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: "inventory_2",
  }),
  TOGGLE_FEATURED: (isFeatured) => ({
    title: isFeatured ? "Feature Product" : "Unfeature Product",
    message: `${isFeatured ? "Feature" : "Unfeature"} this product?`,
    confirmText: isFeatured ? "Feature" : "Unfeature",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: "star",
  }),
  DELETE_PRODUCT: {
    title: "Delete Product",
    message: "Are you sure you want to delete this product? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.DANGER,
    icon: "delete",
  },
  DELETE_IMAGE: {
    title: "Delete Image",
    message: "Delete this image?",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: "image",
  },
  PRODUCT_CREATED: {
    title: "Product Created",
    message: "Product has been successfully created.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  PRODUCT_UPDATED: {
    title: "Product Updated",
    message: "Product has been successfully updated.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  IMAGE_UPLOADED: {
    title: "Image Uploaded",
    message: "Image uploaded successfully!",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  IMAGE_DELETED: {
    title: "Image Deleted",
    message: "Image deleted successfully!",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== REVIEW MANAGEMENT MESSAGES ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for admin review management
 */
export const ADMIN_REVIEW_ALERT_MESSAGES = {
  DELETE_REVIEW: {
    title: "Delete Review",
    message: "Are you sure you want to delete this review? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.DANGER,
    icon: "delete",
  },
  TOGGLE_APPROVAL: (isApproved) => ({
    title: isApproved ? "Approve Review" : "Unapprove Review",
    message: `${isApproved ? "Approve" : "Unapprove"} this review?`,
    confirmText: isApproved ? "Approve" : "Unapprove",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: isApproved ? "check_circle" : "cancel",
  }),
  REVIEW_DELETED: {
    title: "Review Deleted",
    message: "Review has been successfully deleted.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== POST MANAGEMENT MESSAGES ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Alert messages for admin post management
 */
export const ADMIN_POST_ALERT_MESSAGES = {
  TOGGLE_STATUS: (newStatus) => ({
    title: newStatus === "published" ? "Publish Post" : "Unpublish Post",
    message: `${newStatus === "published" ? "Publish" : "Unpublish"} this post?`,
    confirmText: newStatus === "published" ? "Publish" : "Unpublish",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.CONFIRM,
    icon: newStatus === "published" ? "publish" : "unpublished",
  }),
  DELETE_POST: {
    title: "Delete Post",
    message: "Are you sure you want to delete this post? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: ADMIN_ALERT_MODAL_TYPES.DANGER,
    icon: "delete",
  },
  POST_CREATED: {
    title: "Post Created",
    message: "Post has been successfully created.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  POST_UPDATED: {
    title: "Post Updated",
    message: "Post has been successfully updated.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  POST_DELETED: {
    title: "Post Deleted",
    message: "Post has been successfully deleted.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== GENERAL ERROR MESSAGES ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Admin error alert configurations
 */
export const ADMIN_ERROR_ALERT_MESSAGES = {
  GENERIC_ERROR: (errorMessage) => ({
    title: "Error",
    message: `Error: ${errorMessage}`,
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.ERROR,
    icon: "error",
  }),
  OPERATION_FAILED: {
    title: "Operation Failed",
    message: "The operation could not be completed. Please try again.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.ERROR,
    icon: "error",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== SUCCESS MESSAGES ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Admin success alert configurations
 */
export const ADMIN_SUCCESS_ALERT_MESSAGES = {
  OPERATION_SUCCESS: {
    title: "Success",
    message: "Operation completed successfully.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "check_circle",
  },
  CHANGES_SAVED: {
    title: "Saved",
    message: "Your changes have been saved.",
    confirmText: "OK",
    showCancel: false,
    type: ADMIN_ALERT_MODAL_TYPES.SUCCESS,
    icon: "save",
  },
};
