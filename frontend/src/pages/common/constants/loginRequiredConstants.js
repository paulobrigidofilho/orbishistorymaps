///////////////////////////////////////////////////////////////////////
// ============== LOGIN REQUIRED CONSTANTS =========================== //
///////////////////////////////////////////////////////////////////////

// This file contains all constants used by LoginRequired component
// Centralizes configuration, defaults, and text content

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default prop values for LoginRequired component
 */
export const LOGIN_REQUIRED_DEFAULTS = {
  icon: "lock",
  title: "Please Log In",
  message: "You need to be logged in to view this content.",
  buttonText: "Sign In",
  iconColor: "#3498db",
};

///////////////////////////////////////////////////////////////////////
// =================== PAGE-SPECIFIC CONFIGURATIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Pre-configured settings for different pages requiring login
 */
export const LOGIN_REQUIRED_CONFIGS = {
  // My Reviews Page
  MY_REVIEWS: {
    icon: "rate_review",
    title: "Please Log In",
    message: "You need to be logged in to view your reviews.",
    buttonText: "Sign In",
    iconColor: "#f39c12",
  },
  
  // My Orders Page
  MY_ORDERS: {
    icon: "receipt_long",
    title: "Please Log In",
    message: "You need to be logged in to view your orders.",
    buttonText: "Sign In",
    iconColor: "#3498db",
  },
  
  // Wishlist Page
  WISHLIST: {
    icon: "favorite_border",
    title: "Please Log In",
    message: "You need to be logged in to view your wishlist.",
    buttonText: "Sign In",
    iconColor: "#e74c3c",
  },
  
  // Profile Page
  PROFILE: {
    icon: "person",
    title: "Please Log In",
    message: "You need to be logged in to view your profile.",
    buttonText: "Sign In",
    iconColor: "#9b59b6",
  },
  
  // Checkout Page
  CHECKOUT: {
    icon: "shopping_cart_checkout",
    title: "Please Log In",
    message: "You need to be logged in to complete your purchase.",
    buttonText: "Sign In",
    iconColor: "#27ae60",
  },
  
  // Generic Protected Content
  GENERIC: {
    icon: "lock",
    title: "Authentication Required",
    message: "Please log in to access this content.",
    buttonText: "Sign In",
    iconColor: "#3498db",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== ICON OPTIONS ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Available Material Icons for login required screens
 */
export const LOGIN_REQUIRED_ICONS = {
  LOCK: "lock",
  ACCOUNT: "account_circle",
  REVIEW: "rate_review",
  ORDER: "receipt_long",
  WISHLIST: "favorite_border",
  PROFILE: "person",
  CHECKOUT: "shopping_cart_checkout",
  KEY: "vpn_key",
  SHIELD: "security",
};

///////////////////////////////////////////////////////////////////////
// =================== COLOR OPTIONS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Suggested icon colors for different contexts
 */
export const LOGIN_REQUIRED_COLORS = {
  PRIMARY: "#3498db",
  WARNING: "#f39c12",
  DANGER: "#e74c3c",
  SUCCESS: "#27ae60",
  PURPLE: "#9b59b6",
  DARK: "#2c3e50",
};
