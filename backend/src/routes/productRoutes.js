////////////////////////////////////////
// ======= PRODUCT ROUTES ============ //
////////////////////////////////////////

// This route file handles product-related endpoints

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Middleware imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

// ======= Controller imports ======= //
const productController = require("../controllers/productController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Get all products (with optional filters)
// Query params: category, minPrice, maxPrice, search, featured, limit, offset
router.get("/products", productController.getProducts);

// Get single product by ID or slug
router.get("/products/:identifier", productController.getProduct);

// Create product (admin only)
router.post("/products", requireAdmin, productController.create);

// Update product (admin only)
router.put("/products/:productId", requireAdmin, productController.update);

module.exports = router;
