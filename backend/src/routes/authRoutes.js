// ======= Module imports ======= //

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES DEFINITION ===================== //
///////////////////////////////////////////////////////////////////////

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;