///////////////////////////////////////////////////
// ================== HEALTH SERVICE =========== //
///////////////////////////////////////////////////

// This service provides health check functionalities
// for the application, including database connectivity checks

// ======= Module Imports ======= //
const db = require('../config/db'); // Adjust the path as necessary

// New health service
const getHealthStatus = async () => {
  // basic checks; expand as needed
  const uptime = process.uptime();
  const timestamp = Date.now();

  // Try a simple DB ping using the pool
  let dbHealthy = true;
  try {
    await db.promise().query('SELECT 1');
  } catch (e) {
    dbHealthy = false;
  }

  return {
    status: dbHealthy ? 'ok' : 'degraded',
    uptime,
    timestamp,
    checks: {
      db: dbHealthy ? 'ok' : 'error'
    }
  };
};

module.exports = {
  getHealthStatus
};