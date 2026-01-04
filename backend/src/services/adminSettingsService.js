///////////////////////////////////////////////////////////////////////
// ================ ADMIN SETTINGS SERVICE (SEQUELIZE) ============= //
///////////////////////////////////////////////////////////////////////

// This service handles admin site settings operations
// Manages maintenance mode, general settings, and configuration

// ======= Module Imports ======= //
const { SiteSettings } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ DEFAULT SETTINGS =============================== //
///////////////////////////////////////////////////////////////////////

const DEFAULT_SETTINGS = {
  // General settings
  site_name: { value: "Orbis History Maps", type: "string", category: "general", description: "Site name" },
  site_email: { value: "admin@orbis.com", type: "string", category: "general", description: "Site contact email" },
  
  // Store settings
  currency: { value: "NZD", type: "string", category: "store", description: "Default currency" },
  tax_rate: { value: 15, type: "number", category: "store", description: "Tax rate percentage" },
  default_shipping_fee: { value: 10.00, type: "number", category: "store", description: "Default shipping fee" },
  
  // Maintenance settings
  maintenance_mode: { value: "off", type: "string", category: "maintenance", description: "Maintenance mode: off, site-wide, shop-only, registration-only" },
  maintenance_message: { value: "We are currently performing scheduled maintenance. Please check back soon.", type: "string", category: "maintenance", description: "Message to display during maintenance" },
  
  // Feature toggles
  enable_registration: { value: true, type: "boolean", category: "features", description: "Allow new user registration" },
  enable_reviews: { value: true, type: "boolean", category: "features", description: "Allow product reviews" },
  enable_wishlist: { value: true, type: "boolean", category: "features", description: "Enable wishlist feature" },
};

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Initialize default settings in database if they don't exist
 */
const initializeDefaultSettings = async () => {
  try {
    for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
      const existing = await SiteSettings.findOne({ where: { setting_key: key } });
      if (!existing) {
        await SiteSettings.setSetting(key, config.value, {
          type: config.type,
          description: config.description,
          category: config.category,
        });
        console.log(`✓ Initialized setting: ${key}`);
      }
    }
    return true;
  } catch (error) {
    console.error("Error initializing settings:", error);
    throw error;
  }
};

/**
 * Get all site settings
 * @returns {Promise<Object>} All settings as key-value pairs
 */
const getAllSettings = async () => {
  try {
    const settings = await SiteSettings.getAllSettings();
    
    // Ensure all default settings exist in response
    const result = { ...settings };
    for (const [key, config] of Object.entries(DEFAULT_SETTINGS)) {
      if (result[key] === undefined) {
        result[key] = config.value;
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error getting all settings:", error);
    throw error;
  }
};

/**
 * Get settings by category
 * @param {string} category - Category name
 * @returns {Promise<Object>} Settings for the category
 */
const getSettingsByCategory = async (category) => {
  try {
    return await SiteSettings.getSettingsByCategory(category);
  } catch (error) {
    console.error(`Error getting settings for category ${category}:`, error);
    throw error;
  }
};

/**
 * Get a single setting
 * @param {string} key - Setting key
 * @returns {Promise<any>} Setting value
 */
const getSetting = async (key) => {
  try {
    const defaultConfig = DEFAULT_SETTINGS[key];
    const defaultValue = defaultConfig ? defaultConfig.value : null;
    return await SiteSettings.getSetting(key, defaultValue);
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    throw error;
  }
};

/**
 * Update a single setting
 * @param {string} key - Setting key
 * @param {any} value - New value
 * @returns {Promise<Object>} Updated setting
 */
const updateSetting = async (key, value) => {
  try {
    const defaultConfig = DEFAULT_SETTINGS[key];
    const options = defaultConfig ? {
      type: defaultConfig.type,
      description: defaultConfig.description,
      category: defaultConfig.category,
    } : { type: "string", category: "general" };
    
    await SiteSettings.setSetting(key, value, options);
    return { key, value };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
};

/**
 * Update multiple settings at once
 * @param {Object} settings - Object with key-value pairs
 * @returns {Promise<Object>} Updated settings
 */
const updateMultipleSettings = async (settings) => {
  try {
    const updated = {};
    
    for (const [key, value] of Object.entries(settings)) {
      const defaultConfig = DEFAULT_SETTINGS[key];
      const options = defaultConfig ? {
        type: defaultConfig.type,
        description: defaultConfig.description,
        category: defaultConfig.category,
      } : { type: "string", category: "general" };
      
      await SiteSettings.setSetting(key, value, options);
      updated[key] = value;
    }
    
    return updated;
  } catch (error) {
    console.error("Error updating multiple settings:", error);
    throw error;
  }
};

/**
 * Get maintenance mode status
 * @returns {Promise<Object>} Maintenance mode details
 */
const getMaintenanceStatus = async () => {
  try {
    const mode = await getSetting("maintenance_mode");
    const message = await getSetting("maintenance_message");
    
    return {
      mode: mode || "off",
      message: message || DEFAULT_SETTINGS.maintenance_message.value,
      isActive: mode && mode !== "off",
      isSiteWide: mode === "site-wide",
      isShopOnly: mode === "shop-only",
      isRegistrationOnly: mode === "registration-only",
    };
  } catch (error) {
    console.error("Error getting maintenance status:", error);
    throw error;
  }
};

/**
 * Set maintenance mode
 * @param {string} mode - Maintenance mode: off, site-wide, shop-only, registration-only
 * @param {string} message - Optional custom message
 * @returns {Promise<Object>} Updated maintenance status
 */
const setMaintenanceMode = async (mode, message = null) => {
  try {
    const validModes = ["off", "site-wide", "shop-only", "registration-only"];
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid maintenance mode: ${mode}. Valid modes: ${validModes.join(", ")}`);
    }
    
    await updateSetting("maintenance_mode", mode);
    if (message !== null) {
      await updateSetting("maintenance_message", message);
    }
    
    return await getMaintenanceStatus();
  } catch (error) {
    console.error("Error setting maintenance mode:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  initializeDefaultSettings,
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  updateMultipleSettings,
  getMaintenanceStatus,
  setMaintenanceMode,
  DEFAULT_SETTINGS,
};
