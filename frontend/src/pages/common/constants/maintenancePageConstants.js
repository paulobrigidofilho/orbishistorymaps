///////////////////////////////////////////////////////////////////////
// ============= MAINTENANCE PAGE CONSTANTS ========================== //
///////////////////////////////////////////////////////////////////////

// This file contains all constants used by MaintenancePage component
// Centralizes configuration, defaults, and text content

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Default prop values for MaintenancePage component
 */
export const MAINTENANCE_PAGE_DEFAULTS = {
  icon: "build",
  title: "Under Maintenance",
  message: "We are currently performing scheduled maintenance. Please check back soon.",
  buttonText: "Refresh Page",
  iconColor: "#f39c12",
  subtext: "We apologize for any inconvenience. Thank you for your patience.",
};

///////////////////////////////////////////////////////////////////////
// =================== MODE CONFIGURATIONS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Configuration for each maintenance mode
 */
export const MAINTENANCE_MODE_CONFIGS = {
  "site-wide": {
    icon: "build",
    title: "Under Maintenance",
    message: "We are currently performing scheduled maintenance. Please check back soon.",
    iconColor: "#f39c12",
  },
  "shop-only": {
    icon: "store",
    title: "Shop Under Maintenance",
    message: "Our shop is currently undergoing maintenance. Browse our gallery while you wait!",
    iconColor: "#e74c3c",
  },
  "registration-only": {
    icon: "person_add_disabled",
    title: "Registration Unavailable",
    message: "New user registration is temporarily unavailable. Please try again later.",
    iconColor: "#9b59b6",
  },
};

///////////////////////////////////////////////////////////////////////
// =================== MAINTENANCE MODES ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Available maintenance mode values
 */
export const MAINTENANCE_MODES = {
  SITE_WIDE: "site-wide",
  SHOP_ONLY: "shop-only",
  REGISTRATION_ONLY: "registration-only",
};

///////////////////////////////////////////////////////////////////////
// =================== ICON OPTIONS ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Available Material Icons for maintenance pages
 */
export const MAINTENANCE_ICONS = {
  BUILD: "build",
  STORE: "store",
  PERSON_ADD_DISABLED: "person_add_disabled",
  CONSTRUCTION: "construction",
  ENGINEERING: "engineering",
  HANDYMAN: "handyman",
  HOME_REPAIR: "home_repair_service",
};

///////////////////////////////////////////////////////////////////////
// =================== COLOR OPTIONS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Suggested icon colors for different maintenance contexts
 */
export const MAINTENANCE_COLORS = {
  WARNING: "#f39c12",
  DANGER: "#e74c3c",
  PURPLE: "#9b59b6",
  BLUE: "#3498db",
  DARK: "#2c3e50",
};

///////////////////////////////////////////////////////////////////////
// =================== TEXT CONTENT ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Reusable text strings for maintenance pages
 */
export const MAINTENANCE_TEXT = {
  REFRESH_BUTTON: "Refresh Page",
  ADMIN_LINK: "Administrator Access",
  APOLOGY_MESSAGE: "We apologize for any inconvenience. Thank you for your patience.",
};
