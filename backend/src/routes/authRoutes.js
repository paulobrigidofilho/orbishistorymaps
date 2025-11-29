// ======= Module imports ======= //
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const config = require('../config/config');
const upload = config.upload;  

// Import validation middleware
const validate = require('../middleware/validationMiddleware'); 
const auth = require('../middleware/authMiddleware'); 

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

// New logout route
router.post('/logout',
  authController.logout
);

// Protect profile update - require ownership
router.put('/profile/:userId', 
  auth.requireOwnership,
  upload.single('avatar'),
  validate.validateAvatarUpload,
  validate.validateProfileUpdate,
  authController.updateProfile
);

// Avatar upload route
router.post('/upload-avatar', 
  upload.single('avatar'), 
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

// Avatar upload route with userId param
router.post('/upload-avatar/:userId', 
  auth.requireOwnership,
  upload.single('avatar'), 
  validate.validateAvatarUpload,
  authController.uploadAvatar
);

// Session endpoint to allow frontend to restore user from server session
router.get('/session', authController.getSession);

// Get user profile by ID
router.get('/profile/:userId', 
  auth.requireOwnership,
  authController.getProfile
);

// Healthcheck endpoint for Docker/infra
router.get('/health', authController.health);

module.exports = router;