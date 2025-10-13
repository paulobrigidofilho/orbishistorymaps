// ==== Module imports ======= //

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config/config');
require('dotenv').config();


///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = config.port;

///////////////////////////////////////////////////////////////////////
// ========================= MIDDLEWARE ============================ //
///////////////////////////////////////////////////////////////////////

// Configure CORS
app.use(cors(config.corsConfig));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///////////////////////////////////////////////////////////////////////
// ========================= ROUTES ================================ //
///////////////////////////////////////////////////////////////////////

// ===================== Routes Imports ============================ //

const authRoutes = require('./routes/authRoutes.js'); 

// ====================== Routes Setup ============================= //

app.use('/api', authRoutes); 

///////////////////////////////////////////////////////////////////////
// ========================= STATIC FILES ========================== //
///////////////////////////////////////////////////////////////////////

app.use('/uploads/avatars', express.static(config.staticPaths.avatars)); // Serve static files from the avatars directory

///////////////////////////////////////////////////////////////////////
// ========================= SERVER START ========================== //
///////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});