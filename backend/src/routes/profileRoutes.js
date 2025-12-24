/////////////////////////////////////
// ======= PROFILE ROUTES ======== //
/////////////////////////////////////

// This route file handles user profile retrieval and updates

// ======= Module imports ======= //

const express = require("express");
const router = express.Router();

// ======= Middleware imports ======= //
const { upload } = require("../middleware/multerMiddleware");
const validate = require("../middleware/validationMiddleware");
const auth = require("../middleware/authMiddleware");

// ======= Controller imports ======= //
const profileController = require("../controllers/profileController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Get user profile by ID
router.get("/profile/:userId", auth.requireOwnership, profileController.getProfile);

// Profile update with avatar upload handling and validation
router.put(
  "/profile/:userId",
  auth.requireOwnership,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  validate.validateProfileUpdate,
  profileController.updateProfile
);

module.exports = router;
