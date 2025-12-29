///////////////////////////////////////////////
// ======== WISHLIST CONTROLLER =========== ///
///////////////////////////////////////////////

// Controller for handling wishlist HTTP requests
// Uses async/await pattern with service layer

const wishlistService = require("../services/wishlistService");
const { WISHLIST_ERRORS } = require("../constants/errorMessages");
const { WISHLIST_SUCCESS } = require("../constants/successMessages");

/////////////////////////////////////////////
// ===== Get User's Wishlist Items ===== //
/////////////////////////////////////////////

/**
 * GET /api/wishlist
 * Retrieves all items in the user's wishlist with product details
 */
const getWishlist = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const wishlistItems = await wishlistService.getUserWishlist(userId);

    res.status(200).json({
      success: true,
      message: WISHLIST_SUCCESS.WISHLIST_RETRIEVED,
      data: wishlistItems,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: WISHLIST_ERRORS.FETCH_FAILED,
      error: error.message,
    });
  }
};

//////////////////////////////////////////////////
// ===== Add Product to User's Wishlist ===== //
//////////////////////////////////////////////////

/**
 * POST /api/wishlist/items
 * Adds a product to the user's wishlist
 * Body: { productId: string }
 */
const addItem = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if item already exists in wishlist
    const exists = await wishlistService.isInWishlist(userId, productId);

    if (exists) {
      return res.status(409).json({
        success: false,
        message: WISHLIST_ERRORS.ALREADY_EXISTS,
      });
    }

    await wishlistService.addToWishlist(userId, productId);

    res.status(201).json({
      success: true,
      message: WISHLIST_SUCCESS.ITEM_ADDED,
    });
  } catch (error) {
    console.error("Error adding item to wishlist:", error);

    // Handle duplicate key constraint error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: WISHLIST_ERRORS.ALREADY_EXISTS,
      });
    }

    res.status(500).json({
      success: false,
      message: WISHLIST_ERRORS.ADD_FAILED,
      error: error.message,
    });
  }
};

//////////////////////////////////////////////////////
// ===== Remove Product from User's Wishlist ===== //
//////////////////////////////////////////////////////

/**
 * DELETE /api/wishlist/items/:productId
 * Removes a product from the user's wishlist
 * Params: productId
 */
const removeItem = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const result = await wishlistService.removeFromWishlist(userId, productId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: WISHLIST_ERRORS.ITEM_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      message: WISHLIST_SUCCESS.ITEM_REMOVED,
    });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    res.status(500).json({
      success: false,
      message: WISHLIST_ERRORS.REMOVE_FAILED,
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addItem,
  removeItem,
};
