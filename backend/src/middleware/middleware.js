// ======= Module imports ======= //

const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config();

///////////////////////////////////////////////////////////////////////
// ================= CORS CONFIGURATION ================= /////////////
///////////////////////////////////////////////////////////////////////

// This is a configuration object for CORS (Cross-Origin Resource Sharing) settings.

const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200 
}

const setupMiddleware = (app) => {
  
  // ========================= MIDDLEWARE SETUP ======================== //

  try {
    app.use(cors(corsOptions));
    console.log('CORS middleware configured successfully.');
  } catch (error) {
    console.error('Error configuring CORS middleware:', error.message);
  }

  // ========================== JSON BODY PARSER ======================== //

  try {
    app.use(express.json());
    // console.log('JSON body parser middleware configured successfully.');
  } catch (error) {
    console.error('Error configuring JSON body parser middleware:', error.message);
  }

  // =========================== URL ENCODED BODY PARSER ================== //

  try {
    app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
    // console.log('Static files middleware configured successfully.');
  } catch (error) {
    console.error('Error configuring static files middleware:', error.message);
  }
};

module.exports = { setupMiddleware };