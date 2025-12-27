// ==== Module imports ======= //

const express = require("express");
const config = require("./config/config");

///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = config.port;

console.log("Starting Orbis backend server...");

// Configure CORS first to set headers before session processing
app.use(config.corsMiddleware);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount session middleware after CORS
if (config.sessionMiddleware) {
  app.use(config.sessionMiddleware);
  console.log("Session middleware mounted.");
  if (config.getSessionStore) {
    const store = config.getSessionStore();
    if (store) {
      store.on("error", function (error) {
        console.error("Session store error:", error);
      });
    }
  }
} else {
  console.warn("Session middleware is not configured!");
}

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES ================================ //
///////////////////////////////////////////////////////////////////////

// ===================== Routes Imports ============================ //
const registerUserRoutes = require("./routes/registerUserRoutes.js");
const loginUserRoutes = require("./routes/loginUserRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const avatarRoutes = require("./routes/avatarRoutes.js");
const healthRoutes = require("./routes/healthRoutes.js");
const passwordResetRoutes = require("./routes/passwordResetRoutes.js");

// ====================== Routes Setup ============================= //
app.use("/api", registerUserRoutes);
app.use("/api", loginUserRoutes);
app.use("/api", profileRoutes);
app.use("/api", avatarRoutes);
app.use("/api", passwordResetRoutes);
app.use("/health", healthRoutes);

///////////////////////////////////////////////////////////////////////
// ========================= STATIC FILES ========================== //
///////////////////////////////////////////////////////////////////////

app.use("/uploads/avatars", express.static(config.staticPaths.avatars));

///////////////////////////////////////////////////////////////////////
// ========================= SERVER START ========================== //
///////////////////////////////////////////////////////////////////////

(async () => {
  // Wait for session store initialization (MySQL store or fallback)
  if (config.waitForStore) {
    console.log("Waiting for session store to initialize...");
    await config.waitForStore();
    console.log("Session store initialization complete.");
  }

  // Ensure DB is reachable before accepting requests
  await new Promise((resolve) => {
    const checkDb = () => {
      config.db.query("SELECT 1", (err) => {
        if (err) {
          console.log("Database not ready yet, retrying in 1000ms...");
          setTimeout(checkDb, 1000);
        } else {
          console.log("Database is ready.");
          resolve();
        }
      });
    };
    checkDb();
  });

  app.listen(port, () => {
    const env =
      process.env.NODE_ENV === "production" ? "production" : "development";
    console.log(`Server is running on port ${port} (${env} mode)`);
  });
})();
