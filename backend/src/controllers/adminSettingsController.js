///////////////////////////////////////////////////////////////////////
// ================ ADMIN SETTINGS CONTROLLER ====================== //
///////////////////////////////////////////////////////////////////////

// This controller handles admin site settings HTTP requests

const adminSettingsService = require("../services/adminSettingsService");

///////////////////////////////////////////////////////////////////////
// ================ CONTROLLER FUNCTIONS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get all site settings
 * GET /api/admin/settings
 */
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await adminSettingsService.getAllSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error getting all settings:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get settings by category
 * GET /api/admin/settings/category/:category
 */
exports.getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await adminSettingsService.getSettingsByCategory(category);
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error getting settings by category:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get a single setting
 * GET /api/admin/settings/:key
 */
exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const value = await adminSettingsService.getSetting(key);
    res.json({
      success: true,
      data: { key, value },
    });
  } catch (error) {
    console.error("Error getting setting:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update a single setting
 * PUT /api/admin/settings/:key
 */
exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({
        success: false,
        error: "Value is required",
      });
    }
    
    const result = await adminSettingsService.updateSetting(key, value);
    res.json({
      success: true,
      data: result,
      message: "Setting updated successfully",
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update multiple settings at once
 * PUT /api/admin/settings
 */
exports.updateMultipleSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({
        success: false,
        error: "Settings object is required",
      });
    }
    
    const result = await adminSettingsService.updateMultipleSettings(settings);
    res.json({
      success: true,
      data: result,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating multiple settings:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get maintenance mode status (public - no auth required)
 * GET /api/settings/maintenance
 */
exports.getMaintenanceStatus = async (req, res) => {
  try {
    const status = await adminSettingsService.getMaintenanceStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Error getting maintenance status:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Set maintenance mode (admin only)
 * PUT /api/admin/settings/maintenance
 */
exports.setMaintenanceMode = async (req, res) => {
  try {
    const { mode, message } = req.body;
    
    if (!mode) {
      return res.status(400).json({
        success: false,
        error: "Maintenance mode is required",
      });
    }
    
    const result = await adminSettingsService.setMaintenanceMode(mode, message);
    res.json({
      success: true,
      data: result,
      message: `Maintenance mode set to: ${mode}`,
    });
  } catch (error) {
    console.error("Error setting maintenance mode:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Initialize default settings (admin only, usually called once on setup)
 * POST /api/admin/settings/initialize
 */
exports.initializeSettings = async (req, res) => {
  try {
    await adminSettingsService.initializeDefaultSettings();
    res.json({
      success: true,
      message: "Default settings initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing settings:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
