////////////////////////////////////////////////////////////
// =============== ORBIS APP - CONFIGURATIONS =========== //
// =================== VERSION 1.0 ====================== //
////////////////////////////////////////////////////////////
// This configuration file centralizes all application settings
// including environment variables, database connections, middleware,
// authentication, session management, and static resource paths.

// ======= Module Imports ======= //
const path = require("path");

// ======= ENVIRONMENT LOADING ======= //
const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../.env.prod")
    : path.resolve(__dirname, "../../.env.dev");
require("dotenv").config({ path: envFilePath });
console.log(`Loaded environment variables from: ${envFilePath}`);

// ======= DATABASE CONFIGURATION ======= //
const { dbConfig, db } = require("./dbConfig");

// ======= CORS MIDDLEWARE ======= //
const { createCorsMiddleware } = require("../middleware/corsMiddleware");
const corsMiddleware = createCorsMiddleware(process.env.CORS_ORIGIN);

// ======= AUTH CONFIG ======= //
const { authConfig } = require("./authConfig");

// ======= SESSION MANAGEMENT ======= //
const { createSessionMiddleware } = require("../middleware/sessionMiddleware");
const { sessionMiddleware, getSessionStore, waitForStore, isStoreReady } =
  createSessionMiddleware(authConfig, dbConfig);

// ======= STATIC PATHS ======= //
const staticPaths = {
  avatars: path.resolve(__dirname, "../../uploads/avatars"),
  products: path.resolve(__dirname, "../../uploads/products"),
};

// ======= FINAL CONFIG EXPORT ======= //
const config = {
  port: process.env.PORT || 4000,
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4000",

  db,
  dbConfig,

  corsMiddleware,
  authConfig,
  sessionMiddleware,

  getSessionStore,
  sessionStore: getSessionStore,
  waitForStore,
  isStoreReady,

  staticPaths,
};

module.exports = config;
