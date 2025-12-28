/////////////////////////////////////
// ===== ADMIN STATS ROUTES ======= //
/////////////////////////////////////

// Admin routes for dashboard statistics

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller imports ======= //
const { getStats } = require("../controllers/adminStatsController");

// ======= Middleware imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

///////////////////////////////////
// ===== ROUTE DEFINITIONS ===== //
///////////////////////////////////

// ===== GET /api/admin/stats ===== //
// Get dashboard statistics
// Access: Admin only
router.get("/admin/stats", requireAdmin, getStats);

///////////////////////////////////
// ===== MODULE EXPORTS ======== //
///////////////////////////////////

module.exports = router;
