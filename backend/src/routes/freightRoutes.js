///////////////////////////////////////////////////////////////////////
// ================ FREIGHT ROUTES ================================= //
///////////////////////////////////////////////////////////////////////

// Routes for freight configuration management
// Includes both admin and public endpoints

const express = require("express");
const router = express.Router();

// ======= Middleware Imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

// ======= Controller Imports ======= //
const freightController = require("../controllers/freightController");

///////////////////////////////////////////////////////////////////////
// ================ ADMIN ROUTES (Protected) ======================= //
///////////////////////////////////////////////////////////////////////

// Get freight configuration (admin)
router.get("/admin/freight", requireAdmin, freightController.getFreightConfig);

// Update freight configuration (admin)
router.put("/admin/freight", requireAdmin, freightController.updateFreightConfig);

// Get local zone configuration (admin)
router.get("/admin/freight/local-zone", requireAdmin, freightController.getLocalZoneConfig);

// Update local zone configuration (admin)
router.put("/admin/freight/local-zone", requireAdmin, freightController.updateLocalZoneConfig);

// Get available North Island cities for local zone (admin)
router.get("/admin/freight/available-cities", requireAdmin, freightController.getAvailableCities);

///////////////////////////////////////////////////////////////////////
// ================ PUBLIC ROUTES ================================== //
///////////////////////////////////////////////////////////////////////

// Get freight configuration (public - for checkout)
router.get("/freight/config", freightController.getPublicFreightConfig);

// Get all zone costs (public)
router.get("/freight/zones", freightController.getZoneCosts);

// Calculate freight cost (public - for checkout)
router.post("/freight/calculate", freightController.calculateFreightCost);

// Get supported countries list
router.get("/freight/supported-countries", freightController.getSupportedCountries);

// Get freight zones information (zones, thresholds, countries)
router.get("/freight/zones-info", freightController.getFreightZonesInfo);

// Calculate freight from address (Google Places integration)
router.post("/freight/calculate-from-address", freightController.calculateFreightFromAddress);

// Validate shipping address
router.post("/freight/validate-address", freightController.validateShippingAddress);

module.exports = router;
