// ======= Module imports ======= //
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/multer');
// console.log("Value of upload:", upload);  

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES DEFINITION ===================== //
///////////////////////////////////////////////////////////////////////

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:userId', authController.getProfile);
router.put('/profile/:userId', authController.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), authController.uploadAvatar);
router.post('/upload-avatar/:userId', upload.single('avatar'), authController.uploadAvatar);

module.exports = router;