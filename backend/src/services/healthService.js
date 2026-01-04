///////////////////////////////////////////////////////////////////////
// ================ HEALTH SERVICE (SEQUELIZE) ===================== //
///////////////////////////////////////////////////////////////////////

// This service provides health check functionalities
// for the application, including database connectivity checks

// ======= Module Imports ======= //
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ======= getHealthStatus Function ======= //
// Returns the health status of the application

const getHealthStatus = async () => {
  // basic checks; expand as needed
  const uptime = process.uptime();
  const timestamp = Date.now();

  // Try a simple DB ping using Sequelize
  let dbHealthy = true;
  try {
    await sequelize.authenticate();
  } catch (e) {
    dbHealthy = false;
    console.error("[health] Database connection error:", e.message);
  }

  return {
    status: dbHealthy ? "ok" : "degraded",
    uptime,
    timestamp,
    checks: {
      db: dbHealthy ? "ok" : "error",
    },
  };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = { getHealthStatus };
