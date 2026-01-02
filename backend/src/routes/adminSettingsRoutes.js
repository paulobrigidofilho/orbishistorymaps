///////////////////////////////////////////////////////////////////////
// ================ ADMIN SETTINGS ROUTES ========================== //
///////////////////////////////////////////////////////////////////////

// Admin routes for site settings management

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller imports ======= //
const {
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  updateSetting,
  updateMultipleSettings,
  getMaintenanceStatus,
  setMaintenanceMode,
  initializeSettings,
} = require("../controllers/adminSettingsController");

// ======= Middleware imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

///////////////////////////////////////////////////////////////////////
// ================ PUBLIC ROUTES (NO AUTH) ======================== //
///////////////////////////////////////////////////////////////////////

// Get maintenance status - public endpoint for all users
router.get("/settings/maintenance", getMaintenanceStatus);

///////////////////////////////////////////////////////////////////////
// ================ ADMIN ROUTES ================================== //
///////////////////////////////////////////////////////////////////////

// Get all settings
router.get("/admin/settings", requireAdmin, getAllSettings);

// Get settings by category
router.get("/admin/settings/category/:category", requireAdmin, getSettingsByCategory);

// Initialize default settings
router.post("/admin/settings/initialize", requireAdmin, initializeSettings);

// Set maintenance mode
router.put("/admin/settings/maintenance", requireAdmin, setMaintenanceMode);

// Update multiple settings
router.put("/admin/settings", requireAdmin, updateMultipleSettings);

// Get a single setting
router.get("/admin/settings/:key", requireAdmin, getSetting);

// Update a single setting
router.put("/admin/settings/:key", requireAdmin, updateSetting);

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = router;
