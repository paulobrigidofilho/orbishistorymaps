///////////////////////////////////
// ======= CONFIG ROUTES ======= //
///////////////////////////////////
// This file defines configuration-related routes
// including a route to fetch public runtime configuration.

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();
const getPublicConfig = require("../helpers/getPublicConfig");

router.get("/", (req, res) => {
  try {
    const cfg = getPublicConfig();
    return res.json(cfg);
  } catch (err) {
    console.error("Error serving /config:", err);
    return res.status(500).json({ error: "Failed to read public config" });
  }
});

module.exports = router;
