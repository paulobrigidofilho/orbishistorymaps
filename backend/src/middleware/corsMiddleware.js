////////////////////////////////////////
// ===== CORS MIDDLEWARE ============ //
////////////////////////////////////////

// This middleware configures Cross-Origin Resource Sharing (CORS) settings
// to allow controlled access from frontend applications

// ===== Module Imports ===== //

const cors = require("cors");

// ===== CORS Middleware Setup ===== //

function createCorsMiddleware(origin) {
  const corsConfig = {
    origin: origin || "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  };

  console.log(`CORS configured for origin: ${corsConfig.origin}`);

  return cors(corsConfig);
}

module.exports = { createCorsMiddleware };
