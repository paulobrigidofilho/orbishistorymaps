///////////////////////////////////////////////
// ====== ADMIN WISHLIST CONTROLLER ======= ///
///////////////////////////////////////////////

// Controller for handling admin wishlist HTTP requests
// Uses async/await pattern with service layer

// ======= Service Imports ======= //
const {
  getAllProductsWithWishlistCounts,
  getUsersWithProductInWishlist,
  getProductWishlistCount,
  getWishlistStats,
  removeUserWishlistItem,
} = require("../services/adminWishlistService");

// ======= Helper Imports ======= //
const { handleServerError } = require("../helpers/handleServerError");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS, ADMIN_SUCCESS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== CONTROLLER FUNCTIONS ==== //
///////////////////////////////////

///////////////////////////////////////////////////////////////////////
// ===== Get All Products With Wishlist Counts ===== //
///////////////////////////////////////////////////////////////////////

/**
 * GET /api/admin/wishlists
 * Retrieves paginated list of products with wishlist counts
 */
const getProductsWithWishlistCounts = async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || "",
      sortBy: req.query.sortBy || "wishlist_count",
      sortOrder: req.query.sortOrder || "desc",
    };

    console.log("GET /api/admin/wishlists requested with filters:", filters);

    const result = await getAllProductsWithWishlistCounts(filters);

    console.log(
      `Retrieved ${result.products.length} products with wishlist data (page ${result.pagination.page}/${result.pagination.totalPages})`
    );

    return res.status(200).json({
      success: true,
      message: "Wishlist data retrieved successfully",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getProductsWithWishlistCounts:", error);
    return handleServerError(res, error, "Get wishlist data error");
  }
};

///////////////////////////////////////////////////////////////////////
// ===== Get Users For Product Wishlist ===== //
///////////////////////////////////////////////////////////////////////

/**
 * GET /api/admin/wishlists/:productId/users
 * Retrieves all users who have a product in their wishlist
 */
const getProductWishlistUsers = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    console.log(`GET /api/admin/wishlists/${productId}/users requested`);

    const users = await getUsersWithProductInWishlist(productId);

    console.log(`Retrieved ${users.length} users for product ${productId}`);

    return res.status(200).json({
      success: true,
      message: "Wishlist users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in getProductWishlistUsers:", error);
    return handleServerError(res, error, "Get wishlist users error");
  }
};

///////////////////////////////////////////////////////////////////////
// ===== Get Wishlist Count For Product ===== //
///////////////////////////////////////////////////////////////////////

/**
 * GET /api/admin/wishlists/:productId/count
 * Gets the wishlist count for a specific product
 */
const getWishlistCountForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    console.log(`GET /api/admin/wishlists/${productId}/count requested`);

    const count = await getProductWishlistCount(productId);

    return res.status(200).json({
      success: true,
      message: "Wishlist count retrieved successfully",
      data: { productId, count },
    });
  } catch (error) {
    console.error("Error in getWishlistCountForProduct:", error);
    return handleServerError(res, error, "Get wishlist count error");
  }
};

///////////////////////////////////////////////////////////////////////
// ===== Get Wishlist Statistics ===== //
///////////////////////////////////////////////////////////////////////

/**
 * GET /api/admin/wishlists/stats
 * Gets overall wishlist statistics
 */
const getWishlistStatistics = async (req, res) => {
  try {
    console.log("GET /api/admin/wishlists/stats requested");

    const stats = await getWishlistStats();

    return res.status(200).json({
      success: true,
      message: "Wishlist stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error in getWishlistStatistics:", error);
    return handleServerError(res, error, "Get wishlist stats error");
  }
};

///////////////////////////////////////////////////////////////////////
// ===== Remove User's Wishlist Item (Admin) ===== //
///////////////////////////////////////////////////////////////////////

/**
 * DELETE /api/admin/wishlists/:productId/users/:userId
 * Admin removes a product from a user's wishlist
 */
const removeWishlistItem = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and User ID are required",
      });
    }

    console.log(`DELETE /api/admin/wishlists/${productId}/users/${userId} requested`);

    const result = await removeUserWishlistItem(userId, productId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    console.log(`Removed product ${productId} from user ${userId}'s wishlist`);

    return res.status(200).json({
      success: true,
      message: "Wishlist item removed successfully",
    });
  } catch (error) {
    console.error("Error in removeWishlistItem:", error);
    return handleServerError(res, error, "Remove wishlist item error");
  }
};

module.exports = {
  getProductsWithWishlistCounts,
  getProductWishlistUsers,
  getWishlistCountForProduct,
  getWishlistStatistics,
  removeWishlistItem,
};
