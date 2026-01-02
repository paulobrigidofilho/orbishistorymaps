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
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const adminUserRoutes = require("./routes/adminUserRoutes.js");
const adminProductRoutes = require("./routes/adminProductRoutes.js");
const adminStatsRoutes = require("./routes/adminStatsRoutes.js");
const adminOrderRoutes = require("./routes/adminOrderRoutes.js");
const adminWishlistRoutes = require("./routes/adminWishlistRoutes.js");
const adminReviewRoutes = require("./routes/adminReviewRoutes.js");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const freightRoutes = require("./routes/freightRoutes.js");

// ====================== Routes Setup ============================= //

// Review routes - mounted early to ensure public product reviews route works
app.use("/api/reviews", reviewRoutes);

app.use("/api", registerUserRoutes);
app.use("/api", loginUserRoutes);
app.use("/api", profileRoutes);
app.use("/api", avatarRoutes);
app.use("/api", passwordResetRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", adminUserRoutes);
app.use("/api", adminProductRoutes);
app.use("/api", adminStatsRoutes);
app.use("/api", adminWishlistRoutes);
app.use("/api", adminReviewRoutes);
app.use("/api", adminOrderRoutes);
app.use("/api", adminSettingsRoutes);
app.use("/api", freightRoutes);
app.use("/health", healthRoutes);

///////////////////////////////////////////////////////////////////////
// ========================= STATIC FILES ========================== //
///////////////////////////////////////////////////////////////////////

app.use("/uploads/avatars", express.static(config.staticPaths.avatars));
app.use("/uploads/products", express.static(config.staticPaths.products));

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

  // Initialize Sequelize and ensure DB is reachable before accepting requests
  const { testConnection } = require("./config/sequelizeConfig");
  const { syncDatabase } = require("./models");

  try {
    // Test Sequelize connection
    console.log("Testing Sequelize database connection...");
    await testConnection();
    console.log("Sequelize database connection successful.");

    // Sync models (in development, this ensures tables exist)
    // In production, use migrations instead
    if (process.env.NODE_ENV !== "production") {
      console.log("Syncing Sequelize models...");
      await syncDatabase();
      console.log("Sequelize models synced.");
    }
  } catch (error) {
    console.error("Failed to initialize Sequelize:", error);
    // Fall back to raw MySQL check for backward compatibility
    await new Promise((resolve) => {
      const checkDb = () => {
        config.db.query("SELECT 1", (err) => {
          if (err) {
            console.log("Database not ready yet, retrying in 1000ms...");
            setTimeout(checkDb, 1000);
          } else {
            console.log("Database is ready (fallback check).");
            resolve();
          }
        });
      };
      checkDb();
    });
  }

  app.listen(port, () => {
    const env =
      process.env.NODE_ENV === "production" ? "production" : "development";
    console.log(`Server is running on port ${port} (${env} mode)`);
  });
})();
