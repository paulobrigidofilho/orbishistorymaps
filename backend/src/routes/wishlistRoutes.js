///////////////////////////////////////////////
// ========== WISHLIST ROUTES ============= ///
///////////////////////////////////////////////

// Route definitions for wishlist endpoints
// Requires authentication middleware for all routes

const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { requireAuth } = require("../middleware/authMiddleware");

//////////////////////////////////////////////
// ===== Apply Auth Middleware ===== //
//////////////////////////////////////////////

// All wishlist routes require authentication
router.use(requireAuth);

////////////////////////////////////////////////
// ===== GET User's Wishlist Items ===== //
////////////////////////////////////////////////

/**
 * GET /api/wishlist
 * Retrieves all items in the user's wishlist with product details
 * Authentication required
 */
router.get("/wishlist", wishlistController.getWishlist);

//////////////////////////////////////////////////////////
// ===== POST Add Product to User's Wishlist ===== //
//////////////////////////////////////////////////////////

/**
 * POST /api/wishlist/items
 * Adds a product to the user's wishlist
 * Body: { productId: string }
 * Authentication required
 */
router.post("/wishlist/items", wishlistController.addItem);

////////////////////////////////////////////////////////////
// ===== DELETE Remove Product from Wishlist ===== //
////////////////////////////////////////////////////////////

/**
 * DELETE /api/wishlist/items/:productId
 * Removes a product from the user's wishlist
 * Params: productId
 * Authentication required
 */
router.delete("/wishlist/items/:productId", wishlistController.removeItem);

module.exports = router;
