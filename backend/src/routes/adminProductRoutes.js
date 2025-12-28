////////////////////////////////////////////////
// ======== ADMIN PRODUCT ROUTES ============= //
////////////////////////////////////////////////

// This file defines admin routes for product management (CRUD + image upload)

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ======= Middleware Imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

// ======= Controller Imports ======= //
const adminProductController = require("../controllers/adminProductController");

// ======= Validator Imports ======= //
const {
  createProductSchema,
  updateProductSchema,
  querySchema,
} = require("../validators/adminValidator");

///////////////////////////////////
// ===== MULTER CONFIGURATION ==== //
///////////////////////////////////

// Configure multer for product image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, "../../uploads/products");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WebP) are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

///////////////////////////////////
// ===== ROUTE DEFINITIONS ======= //
///////////////////////////////////

// GET /api/admin/products - List all products with pagination
router.get("/admin/products", requireAdmin, validateRequest(querySchema, "query"), adminProductController.getProducts);

// GET /api/admin/products/:productId - Get single product
router.get("/admin/products/:productId", requireAdmin, adminProductController.getProduct);

// POST /api/admin/products - Create new product
router.post(
  "/admin/products",
  requireAdmin,
  validateRequest(createProductSchema),
  adminProductController.createProduct
);

// PATCH /api/admin/products/:productId - Update product
router.patch(
  "/admin/products/:productId",
  requireAdmin,
  validateRequest(updateProductSchema),
  adminProductController.updateProduct
);

// DELETE /api/admin/products/:productId - Soft delete product
router.delete("/admin/products/:productId", requireAdmin, adminProductController.deleteProduct);

// POST /api/admin/products/:productId/images - Upload product image
router.post(
  "/admin/products/:productId/images",
  requireAdmin,
  upload.single("image"),
  adminProductController.uploadImage
);

// DELETE /api/admin/products/images/:imageId - Delete product image
router.delete("/admin/products/images/:imageId", requireAdmin, adminProductController.deleteImage);

module.exports = router;
