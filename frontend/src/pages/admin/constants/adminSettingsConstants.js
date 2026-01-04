///////////////////////////////////////////////////////////////////////
// ================ ADMIN SETTINGS CONSTANTS ======================= //
///////////////////////////////////////////////////////////////////////

// Constants for admin settings pages

// ===== Maintenance Mode Options ===== //
export const MAINTENANCE_MODES = {
  OFF: "off",
  SITE_WIDE: "site-wide",
  SHOP_ONLY: "shop-only",
  REGISTRATION_ONLY: "registration-only",
};

export const MAINTENANCE_MODE_OPTIONS = [
  { value: MAINTENANCE_MODES.OFF, label: "Off", description: "Site fully operational" },
  { value: MAINTENANCE_MODES.SITE_WIDE, label: "Site-Wide", description: "Entire site under maintenance" },
  { value: MAINTENANCE_MODES.SHOP_ONLY, label: "Shop Only", description: "Shop disabled, other pages accessible" },
  { value: MAINTENANCE_MODES.REGISTRATION_ONLY, label: "Registration Only", description: "New registration disabled" },
];

// ===== Currency Options ===== //
export const CURRENCY_OPTIONS = [
  { value: "NZD", label: "NZD - New Zealand Dollar" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
];

// ===== Settings Messages ===== //
export const SETTINGS_MESSAGES = {
  SAVE_SUCCESS: "Settings saved successfully",
  SAVE_ERROR: "Failed to save settings",
  LOAD_ERROR: "Failed to load settings",
  MAINTENANCE_ENABLED: "Maintenance mode enabled",
  MAINTENANCE_DISABLED: "Maintenance mode disabled",
  MAINTENANCE_CHANGE_ERROR: "Failed to change maintenance mode",
};

// ===== Default Settings ===== //
export const DEFAULT_SETTINGS = {
  site_name: "Orbis History Maps",
  site_email: "admin@orbis.com",
  currency: "NZD",
  tax_rate: 15,
  default_shipping_fee: 10.00,
  maintenance_mode: "off",
  maintenance_message: "We are currently performing scheduled maintenance. Please check back soon.",
  enable_registration: true,
  enable_reviews: true,
  enable_wishlist: true,
};

// ===== Maintenance Disabled Features ===== //
export const DISABLED_FEATURES_MESSAGE = "Disabled during maintenance";
