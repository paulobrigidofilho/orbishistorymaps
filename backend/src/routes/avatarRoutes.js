////////////////////////////////////
// ======= AVATAR ROUTES ======== //
////////////////////////////////////

// This route file handles avatar upload, deletion, and serving

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Middleware imports ======= //
const { upload } = require("../middleware/multerMiddleware");
const validate = require("../middleware/validationMiddleware");
const auth = require("../middleware/authMiddleware");

// ======= Controller imports ======= //
const avatarController = require("../controllers/avatarController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Avatar Upload Route
router.post(
  "/avatar/:userId",
  auth.requireOwnershipOrAdmin,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  avatarController.uploadAvatar
);

// Avatar Deletion Route
router.delete(
  "/avatar/:userId",
  auth.requireOwnershipOrAdmin,
  avatarController.deleteAvatar
);

// Serve Avatar Route
router.get("/avatars/:filename", avatarController.serveAvatar);

module.exports = router;
