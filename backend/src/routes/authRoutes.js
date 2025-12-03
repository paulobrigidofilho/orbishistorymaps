/////////////////////////////////
// ======= AUTH ROUTES ======= //
/////////////////////////////////

// DEPRECATED: This legacy router is kept only for reference.
// It is NOT mounted in server.js. Modular routers are used instead:
// - routes/registerUserRoutes.js
// - routes/loginUserRoutes.js
// - routes/profileRoutes.js
// - routes/avatarRoutes.js

// This file defines authentication-related routes
// including registration, login, profile management, and avatar uploads.

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { upload } = require("../middleware/multerMiddleware");
const validate = require("../middleware/validationMiddleware");
const auth = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES DEFINITION ===================== //
///////////////////////////////////////////////////////////////////////

// Register route with avatar upload handling and validation
router.post(
  "/register",
  upload.single("avatar"),
  validate.validateAvatarUpload,
  validate.validateRegistration,
  authController.register
);

router.post("/login", validate.validateLogin, authController.login);

// Logout route
router.post("/logout", authController.logout);

// Session endpoint to allow frontend to restore user from server session
router.get("/session", authController.getSession);

// Get user profile by ID
router.get(
  "/profile/:userId",
  auth.requireOwnership,
  authController.getProfile
);

// Profile update route with avatar upload handling and validation
router.put(
  "/profile/:userId",
  auth.requireOwnership,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  validate.validateProfileUpdate,
  authController.updateProfile
);

// Avatar upload route
router.post(
  "/upload-avatar",
  upload.single("avatar"),
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

// Avatar upload route with userId param
router.post(
  "/upload-avatar/:userId",
  auth.requireOwnership,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

// Avatar upload route with userId param and session auth
router.post(
  "/avatar/:userId",
  auth.requireOwnership,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

// Delete avatar route
router.delete(
  "/avatar/:userId",
  auth.requireOwnership,
  authController.deleteAvatar
);

// Fallback avatar file serve: /api/avatars/:filename
router.get("/avatars/:filename", (req, res) => {
  const file = req.params.filename;
  const full = path.resolve(__dirname, "../../uploads/avatars", file);
  fs.access(full, fs.constants.R_OK, (err) => {
    if (err) return res.status(404).json({ message: "Avatar not found" });
    res.sendFile(full);
  });
});

module.exports = router;
