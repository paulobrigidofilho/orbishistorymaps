///////////////////////////////////
// ===== MULTER MIDDLEWARE ===== //
///////////////////////////////////

// This middleware sets up file upload handling using multer

// ===== Module Imports ===== //

const path = require("path");
const fs = require("fs");
const multer = require("multer");

// ===== Create upload directories if they don't exist ===== //
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

// ===== Multer Storage Configuration ===== //

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

// ===== Multer Upload Configuration ===== //

const uploadConfig = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
};

const upload = multer(uploadConfig);

module.exports = { upload, uploadConfig };
