///////////////////////////////////////////////////////////////////////
// ================ ADMIN POST FEED ROUTES ========================= //
///////////////////////////////////////////////////////////////////////

// This file defines admin routes for post management
// All routes require admin authentication

// ======= Module Imports ======= //
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======= Middleware Imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

// ======= Controller Imports ======= //
const adminPostFeedController = require("../controllers/adminPostFeedController");

///////////////////////////////////////////////////////////////////////
// ================ MULTER CONFIGURATION =========================== //
///////////////////////////////////////////////////////////////////////

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, "../../uploads/posts");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for post image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `post-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WebP, GIF) are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

///////////////////////////////////////////////////////////////////////
// ================ ROUTE DEFINITIONS ============================== //
///////////////////////////////////////////////////////////////////////

// GET /api/admin/posts/stats - Get post statistics for dashboard
router.get("/admin/posts/stats", requireAdmin, adminPostFeedController.getPostStats);

// GET /api/admin/posts - Get all posts with pagination and filters
router.get("/admin/posts", requireAdmin, adminPostFeedController.getAllPosts);

// GET /api/admin/posts/:postId - Get a single post by ID
router.get("/admin/posts/:postId", requireAdmin, adminPostFeedController.getPostById);

// POST /api/admin/posts - Create a new post
router.post("/admin/posts", requireAdmin, adminPostFeedController.createPost);

// PUT /api/admin/posts/:postId - Update a post
router.put("/admin/posts/:postId", requireAdmin, adminPostFeedController.updatePost);

// DELETE /api/admin/posts/:postId - Delete a post
router.delete("/admin/posts/:postId", requireAdmin, adminPostFeedController.deletePost);

// PATCH /api/admin/posts/:postId/toggle-status - Toggle post status
router.patch("/admin/posts/:postId/toggle-status", requireAdmin, adminPostFeedController.togglePostStatus);

// POST /api/admin/posts/upload-image - Upload post image
router.post("/admin/posts/upload-image", requireAdmin, upload.single("image"), adminPostFeedController.uploadPostImage);

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = router;
