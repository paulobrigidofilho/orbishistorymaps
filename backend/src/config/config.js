////////////////////////////////////////////////////////////
// =============== ORBIS APP - CONFIGURATIONS =========== //
// =================== VERSION 1.0 ====================== //
////////////////////////////////////////////////////////////

// ======= Package Imports ======== //
require("dotenv").config();
const path = require("path");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");

/////////////////////////////////////////////
//// ===== MYSQL DB CONFIGURATION ===== /////
/////////////////////////////////////////////

const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "orbis_db",
};

// Create database connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to database");
  }
});

////////////////////////////////////////
//// ===== CORS CONFIGURATION ===== ////
////////////////////////////////////////

const corsConfig = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

///////////////////////////////////////////
//// ===== MULTER CONFIGURATION ===== /////
///////////////////////////////////////////

// Create directory for file uploads if it doesn't exist
const createUploadDirs = () => {
  const dirs = [
    path.resolve(__dirname, "../../uploads"),
    path.resolve(__dirname, "../../uploads/avatars"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    }
  });
};

createUploadDirs();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, "../../uploads/avatars");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Configure file upload limits and filters
const uploadConfig = {
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
};

const upload = multer(uploadConfig);

//////////////////////////////////////
//// ===== AUTH CONFIGURATION ===== //
//////////////////////////////////////

const authConfig = {
  bcrypt: {
    saltRounds: 10,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
};

/////////////////////////////////////////////////////////////
// ===== GUARD: create session store & middleware if lib present =====
/////////////////////////////////////////////////////////////

let sessionStore = null;
let sessionMiddleware = null;

try {
  // Require session packages only if available
  const session = require('express-session');
  const MySQLStoreFactory = require('express-mysql-session');

  // Create MySQL session store options based on dbConfig
  const sessionStoreOptions = {
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "orbis_db",
  };

  const MySQLStore = MySQLStoreFactory(session);
  sessionStore = new MySQLStore(sessionStoreOptions);

  // Build express-session middleware using authConfig and the created store
  sessionMiddleware = session({
    secret: authConfig.session.secret,
    resave: authConfig.session.resave,
    saveUninitialized: authConfig.session.saveUninitialized,
    cookie: authConfig.session.cookie,
    store: sessionStore,
  });

  console.log('Session middleware configured with MySQL store.');
} catch (err) {
  // If packages not installed, warn and continue without session support
  console.warn('express-session or express-mysql-session not available. Session middleware disabled.', err.message || err);
  sessionStore = null;
  sessionMiddleware = null;
}

//////////////////////////////////////
// ===== CONFIGURATION OBJECT ===== //
//////////////////////////////////////

// Add API URL to the config object
const config = {
  port: process.env.PORT || 4000,
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4000",
  db,
  dbConfig,
  corsConfig,
  upload,
  uploadConfig,
  authConfig,
  sessionStore,      
  sessionMiddleware, 
  staticPaths: {
    avatars: path.resolve(__dirname, "../../uploads/avatars"),
  },
};

module.exports = config;
