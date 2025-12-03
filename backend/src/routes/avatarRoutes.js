////////////////////////////////////
// ======= AVATAR ROUTES ======== //
////////////////////////////////////

// This route file handles avatar upload, deletion, and serving

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

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
  auth.requireOwnership,
  upload.single("avatar"),
  validate.validateAvatarUpload,
  avatarController.uploadAvatar
);

// Avatar Deletion Route
router.delete(
  "/avatar/:userId",
  auth.requireOwnership,
  avatarController.deleteAvatar
);

// Serve Avatar Route
router.get("/avatars/:filename", (req, res) => {
  const file = req.params.filename;
  const full = path.resolve(__dirname, "../../uploads/avatars", file);
  fs.access(full, fs.constants.R_OK, (err) => {
    if (err) return res.status(404).json({ message: "Avatar not found" });
    res.sendFile(full);
  });
});

module.exports = router;
