/////////////////////////////////////
// ======= HEALTH CONTROLLER ======= //
/////////////////////////////////////

// This controller manages health check requests
// including application status and database connectivity checks.

// ======= Module imports ======= //
const { getHealthStatus } = require("../services/healthService");

// ======= Health Check Function ======= //
const health = async (req, res) => {
  try {
    const status = await getHealthStatus();
    const httpCode = status.status === "ok" ? 200 : 503;
    return res.status(httpCode).json(status);
  } catch (err) {
    console.error("Healthcheck error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Healthcheck failed" });
  }
};

module.exports = { health };
