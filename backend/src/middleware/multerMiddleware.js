///////////////////////////////////
// ===== MULTER MIDDLEWARE ===== //
///////////////////////////////////

// This middleware sets up file upload handling using multer

// ===== Module Imports ===== //

const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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
    // Prefer userId from params, fallback to session, then anonymous
    const userId = req.params?.userId || req.session?.user?.id || "anonymous";
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `avatar-${userId}-${timestamp}-${uniqueId}${ext}`;
    // Debug: show final disk path
    const finalPath = path.resolve(
      __dirname,
      "../../uploads/avatars",
      filename
    );
    console.log("[multer] Saving avatar:", {
      original: file.originalname,
      savedAs: filename,
      path: finalPath,
    });
    cb(null, filename);
  },
});

// ===== Multer Upload Configuration ===== //

const uploadConfig = {
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max upload before compression
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
};

const upload = multer(uploadConfig);

module.exports = { upload, uploadConfig };
