/////////////////////////////////
// ======= HEALTH ROUTES ======= //
/////////////////////////////////

// This file defines health check-related routes
// including application status and database connectivity checks.

// ======= Module imports ======= //
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES DEFINITION ===================== //
///////////////////////////////////////////////////////////////////////

router.get('/', healthController.health);

module.exports = router;
