///////////////////////////////////////////////
// ====== ADMIN WISHLIST ROUTES =========== ///
///////////////////////////////////////////////

// Admin routes for wishlist management operations
// Provides access to wishlist statistics and user data

// ======= Module Imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller Imports ======= //
const {
  getProductsWithWishlistCounts,
  getProductWishlistUsers,
  getWishlistCountForProduct,
  getWishlistStatistics,
  removeWishlistItem,
} = require("../controllers/adminWishlistController");

// ======= Middleware Imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");

///////////////////////////////////
// ===== ROUTE DEFINITIONS ===== //
///////////////////////////////////

///////////////////////////////////////////////////////////////////////
// ===== GET /api/admin/wishlists/stats ===== //
// Get overall wishlist statistics
// Access: Admin only
// Note: This route must be BEFORE /:productId routes
///////////////////////////////////////////////////////////////////////
router.get("/admin/wishlists/stats", requireAdmin, getWishlistStatistics);

///////////////////////////////////////////////////////////////////////
// ===== GET /api/admin/wishlists ===== //
// Get all products with wishlist counts (paginated)
// Query params: page, limit, search, sortBy, sortOrder
// Access: Admin only
///////////////////////////////////////////////////////////////////////
router.get("/admin/wishlists", requireAdmin, getProductsWithWishlistCounts);

///////////////////////////////////////////////////////////////////////
// ===== GET /api/admin/wishlists/:productId/users ===== //
// Get all users who have a product in their wishlist
// Access: Admin only
///////////////////////////////////////////////////////////////////////
router.get(
  "/admin/wishlists/:productId/users",
  requireAdmin,
  getProductWishlistUsers
);

///////////////////////////////////////////////////////////////////////
// ===== GET /api/admin/wishlists/:productId/count ===== //
// Get wishlist count for a specific product
// Access: Admin only
///////////////////////////////////////////////////////////////////////
router.get(
  "/admin/wishlists/:productId/count",
  requireAdmin,
  getWishlistCountForProduct
);

///////////////////////////////////////////////////////////////////////
// ===== DELETE /api/admin/wishlists/:productId/users/:userId ===== //
// Remove a product from a user's wishlist (admin action)
// Access: Admin only
///////////////////////////////////////////////////////////////////////
router.delete(
  "/admin/wishlists/:productId/users/:userId",
  requireAdmin,
  removeWishlistItem
);

module.exports = router;
