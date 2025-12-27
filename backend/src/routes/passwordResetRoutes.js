/////////////////////////////////////////////
// ======= PASSWORD RESET ROUTES ========= //
/////////////////////////////////////////////

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Validator imports ======= //
const { validateForgotPassword, validateResetPassword } = require("../validators/userValidator/passwordResetValidator");

// ======= Controller imports ======= //
const passwordResetController = require("../controllers/passwordResetController");

/////////////////////
////// ROUTES ///////
/////////////////////

// ===== Forgot Password Route ===== //
// Initiates password reset process by sending reset email
router.post("/forgot-password", (req, res, next) => {
  const validation = validateForgotPassword(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.error,
      errors: validation.errors
    });
  }
  
  next();
}, passwordResetController.forgotPassword);

// ===== Reset Password Route ===== //
// Completes password reset with valid token and new password
router.post("/reset-password", (req, res, next) => {
  const validation = validateResetPassword(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.error,
      errors: validation.errors
    });
  }
  
  next();
}, passwordResetController.resetPassword);

module.exports = router;
