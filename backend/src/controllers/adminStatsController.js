////////////////////////////////////////////////
// ======= ADMIN STATS CONTROLLER ============ //
////////////////////////////////////////////////

// This controller handles HTTP requests for admin statistics

// ======= Service Imports ======= //
const adminStatsService = require("../services/adminStatsService");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////
// === CONTROLLER FUNCTIONS ==== //
///////////////////////////////////

// ===== getStats Function ===== //
// HTTP handler to retrieve dashboard statistics

const getStats = async (req, res) => {
  try {
    const stats = await adminStatsService.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error in getStats controller:", error);
    res.status(500).json({
      error: ADMIN_ERRORS.STATS_FETCH_ERROR || "Failed to fetch statistics",
    });
  }
};

///////////////////////////////////
// ===== MODULE EXPORTS ======== //
///////////////////////////////////

module.exports = {
  getStats,
};
