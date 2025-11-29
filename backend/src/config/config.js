////////////////////////////////////////////////////////////
// =============== ORBIS APP - CONFIGURATIONS =========== //
// =================== VERSION 1.0 ====================== //
////////////////////////////////////////////////////////////

// ======= Package Imports ======== //
const path = require("path");

// Load environment file based on NODE_ENV (production -> .env.prod, otherwise .env.dev)
const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../.env.prod")
    : path.resolve(__dirname, "../../.env.dev");

require("dotenv").config({ path: envFilePath });
console.log(`Loaded environment variables from: ${envFilePath}`);

const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");

/////////////////////////////////////////////
//// ===== MYSQL DB CONFIGURATION ===== /////
/////////////////////////////////////////////

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// Warn if DB password missing
if (!dbConfig.password) {
  console.warn(
    "WARNING: MYSQL_PASSWORD is not set. Do NOT run this in production."
  );
}

// Create database connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to database (pool is open)");
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
  bcrypt: { saltRounds: 10 },
  session: {
    secret: process.env.SESSION_SECRET,
    cookieName: process.env.SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  },
};
if (!process.env.SESSION_SECRET) {
  console.warn(
    "WARNING: SESSION_SECRET missing. Set it in .env for a public repo."
  );
}
if (!process.env.SESSION_COOKIE_NAME) {
  console.warn(
    "INFO: SESSION_COOKIE_NAME not set, using default 'connect.sid'."
  );
}

///////////////////////////////////////
// ===== SESSION MANAGEMENT ======== //
///////////////////////////////////////

const { createSessionMiddleware } = require("../middleware/sessionMiddleware");
const { sessionMiddleware, getSessionStore } = createSessionMiddleware(
  authConfig,
  dbConfig
);

//////////////////////////////////////
// ===== CONFIGURATION OBJECT ===== //
//////////////////////////////////////

const config = {
  port: process.env.PORT || 4000,
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4000",
  db,
  dbConfig,
  corsConfig,
  upload,
  uploadConfig,
  authConfig,
  sessionStore: getSessionStore,
  sessionMiddleware,
  staticPaths: {
    avatars: path.resolve(__dirname, "../../uploads/avatars"),
  },
};

module.exports = config;
