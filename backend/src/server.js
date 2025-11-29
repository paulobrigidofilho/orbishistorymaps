// ==== Module imports ======= //

const express = require("express");
const cors = require("cors");
const config = require("./config/config");

///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = config.port;

console.log("Starting Orbis backend server...");

// Configure CORS first to set headers before session processing
app.use(cors(config.corsConfig));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount session middleware after CORS
if (config.sessionMiddleware) {
  app.use(config.sessionMiddleware);
  console.log("Session middleware mounted.");
  if (config.sessionStore) {
    const store = typeof config.sessionStore === 'function' ? config.sessionStore() : config.sessionStore;
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
const authRoutes = require("./routes/authRoutes.js");
const configRoutes = require("./routes/configRoutes.js");

// ====================== Routes Setup ============================= //
app.use("/api", authRoutes);
app.use("/config", configRoutes);

///////////////////////////////////////////////////////////////////////
// ========================= STATIC FILES ========================== //
///////////////////////////////////////////////////////////////////////

app.use("/uploads/avatars", express.static(config.staticPaths.avatars)); // Serve static files from the avatars directory

///////////////////////////////////////////////////////////////////////
// ========================= SERVER START ========================== //
///////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  const env = process.env.NODE_ENV === "production" ? "production" : "development";
  console.log(`Server is running on port ${port} (${env} mode)`);
});
