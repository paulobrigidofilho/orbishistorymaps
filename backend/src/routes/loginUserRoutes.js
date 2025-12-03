/////////////////////////////////////
// ======= LOGIN USER ROUTES ===== //
/////////////////////////////////////

// This route file handles user login, logout, and session restoration

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Middleware imports ======= //
const validate = require("../middleware/validationMiddleware");

// ======= Controller imports ======= //
const loginController = require("../controllers/loginController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Login route
router.post("/login", validate.validateLogin, loginController.login);

// Logout route
router.post("/logout", loginController.logout);

// Get session route
router.get("/session", loginController.getSession);

module.exports = router;
