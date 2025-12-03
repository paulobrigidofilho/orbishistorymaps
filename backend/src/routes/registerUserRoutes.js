/////////////////////////////////////////
// ======= REGISTER USER ROUTES ====== //
/////////////////////////////////////////

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Middleware imports ======= //
const { upload } = require("../middleware/multerMiddleware");
const validate = require("../middleware/validationMiddleware");

// ======= Controller imports ======= //
const registerController = require("../controllers/registerController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Register route with avatar upload handling and validation
router.post(
  "/register",
  upload.single("avatar"),
  validate.validateAvatarUpload,
  validate.validateRegistration,
  registerController.register
);

module.exports = router;
