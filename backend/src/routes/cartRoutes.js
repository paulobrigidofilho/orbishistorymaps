////////////////////////////////////////
// =========== CART ROUTES ============ //
////////////////////////////////////////

// This route file handles shopping cart endpoints

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller imports ======= //
const cartController = require("../controllers/cartController");

/////////////////////
////// ROUTES ///////
/////////////////////

// Get user's cart
router.get("/cart", cartController.getUserCart);

// Add item to cart
router.post("/cart/items", cartController.addItemToCart);

// Update cart item quantity
router.put("/cart/items/:cartItemId", cartController.updateItem);

// Remove item from cart
router.delete("/cart/items/:cartItemId", cartController.removeItem);

// Clear entire cart
router.delete("/cart/:cartId", cartController.clearUserCart);

module.exports = router;
