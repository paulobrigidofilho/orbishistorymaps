// ======= Module imports ======= //
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const config = require('../config/config');
const upload = config.upload;  

// Import validation middleware
const validate = require('../middleware/validationMiddleware');

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES DEFINITION ===================== //
///////////////////////////////////////////////////////////////////////

// Apply validation middleware before controllers
router.post('/register', 
  upload.single('avatar'), 
  validate.validateAvatarUpload,
  validate.validateRegistration, 
  authController.register
);

router.post('/login', 
  validate.validateLogin, 
  authController.login
);

router.get('/profile/:userId', 
  authController.getProfile
);

router.put('/profile/:userId', 
  upload.single('avatar'),
  validate.validateAvatarUpload,
  validate.validateProfileUpdate,
  authController.updateProfile
);

router.post('/upload-avatar', 
  upload.single('avatar'), 
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

router.post('/upload-avatar/:userId', 
  upload.single('avatar'), 
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

module.exports = router;