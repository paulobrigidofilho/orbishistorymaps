// ======= Module imports ======= //

const mysql = require('mysql2');
require('dotenv').config();

///////////////////////////////////////////////////////////////////////
// ========================= DATABASE CONFIGURATION ================ //
///////////////////////////////////////////////////////////////////////

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

///////////////////////////////////////////////////////////////////////
// ========================= DATABASE CONNECTION =================== //
///////////////////////////////////////////////////////////////////////

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err; // Throw the error to prevent the server from starting
  } else {
    console.log('Connected to database');
  }
});

module.exports = db;