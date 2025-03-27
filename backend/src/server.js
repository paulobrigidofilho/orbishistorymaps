// ======= Module imports ======= //

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 4000;

///////////////////////////////////////////////////////////////////////
// ========================= MIDDLEWARE ============================ //
///////////////////////////////////////////////////////////////////////

app.use(cors());
app.use(express.json());

///////////////////////////////////////////////////////////////////////
// ========================= MULTER CONFIGURATION ================== //
///////////////////////////////////////////////////////////////////////

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Store avatars in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES ================================ //
///////////////////////////////////////////////////////////////////////

// Import routes
const authRoutes = require('../src/routes/authRoutes');

// Use routes
app.use('/api', authRoutes); // Mount the auth routes under /api

///////////////////////////////////////////////////////////////////////
// ========================= STATIC FILES ========================== //
///////////////////////////////////////////////////////////////////////

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

///////////////////////////////////////////////////////////////////////
// ========================= SERVER START ========================== //
///////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});