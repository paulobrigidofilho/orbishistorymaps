// ==== Module imports ======= //

const path = require("path");
const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = config.port;

///////////////////////////////////////////////////////////////////////
// ========================= MIDDLEWARE ============================ //
///////////////////////////////////////////////////////////////////////

// Mount session middleware from config (session store and options are defined in config.js)
app.use(config.sessionMiddleware);

// Configure CORS
app.use(cors(config.corsConfig));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
