// ==== Module imports ======= //

const express = require('express');
const path = require('path');
require('dotenv').config();
const { setupMiddleware } = require('./middleware/middleware'); 

///////////////////////////////////////////////////////////////////////
// ========================= APP INITIALIZATION ==================== //
///////////////////////////////////////////////////////////////////////

const app = express();
const port = process.env.PORT || 4000;

///////////////////////////////////////////////////////////////////////
// ========================= MIDDLEWARE ============================ //
///////////////////////////////////////////////////////////////////////

setupMiddleware(app); 

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

app.use('/uploads/avatars', express.static(path.join(__dirname, '../uploads/avatars'))); // Serve static files from the avatars directory

///////////////////////////////////////////////////////////////////////
// ========================= SERVER START ========================== //
///////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});