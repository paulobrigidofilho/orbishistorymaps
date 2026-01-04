///////////////////////////////////////////////////////////////////////
// ================ ADMIN WISHLIST SERVICE (SEQUELIZE) ============= //
///////////////////////////////////////////////////////////////////////

// Service layer for admin wishlist operations
// Provides wishlist statistics and user details per product

// ======= Module Imports ======= //
const { Op, fn, col, literal } = require("sequelize");

// ======= Model Imports ======= //
const { Wishlist, Product, ProductImage, ProductCategory, User } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// ===== Get All Products With Wishlist Counts (Paginated) ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Retrieves paginated list of products with wishlist counts
 * @param {Object} filters - Pagination and filter options
 * @returns {Promise<Object>} Products with wishlist data and pagination
 */
const getAllProductsWithWishlistCounts = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "wishlist_count",
    sortOrder = "desc",
  } = filters;

  const offset = (page - 1) * limit;

  // Validate sort parameters
  const allowedSortFields = [
    "product_id",
    "product_name",
    "sku",
    "wishlist_count",
    "price",
  ];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "wishlist_count";
  const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  // Build search condition
  const searchCondition = search ? {
    [Op.or]: [
      { product_name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ],
  } : {};

  // Step 1: Get product IDs with wishlist counts (no JOINs in GROUP BY)
  const wishlistCounts = await Wishlist.findAll({
    attributes: [
      "product_id",
      [fn("COUNT", col("wishlist_id")), "wishlist_count"],
    ],
    group: ["product_id"],
    raw: true,
  });

  // Create a map of product_id -> wishlist_count
  const countMap = {};
  wishlistCounts.forEach((w) => {
    countMap[w.product_id] = parseInt(w.wishlist_count) || 0;
  });

  // Get product IDs that have wishlists
  const productIdsWithWishlists = Object.keys(countMap);

  if (productIdsWithWishlists.length === 0) {
    return {
      products: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  // Step 2: Get products with their details
  const whereClause = {
    product_id: { [Op.in]: productIdsWithWishlists },
    ...searchCondition,
  };

  const products = await Product.findAll({
    attributes: [
      "product_id",
      "product_name",
      "sku",
      "price",
      "sale_price",
      "is_active",
    ],
    include: [
      {
        model: ProductCategory,
        as: "category",
        attributes: ["category_name"],
        required: false,
      },
      {
        model: ProductImage,
        as: "images",
        where: { is_primary: true },
        required: false,
        attributes: ["image_url"],
      },
    ],
    where: whereClause,
  });

  // Step 3: Add wishlist counts and format
  let formattedProducts = products.map((p) => {
    const json = p.toJSON();
    return {
      product_id: json.product_id,
      product_name: json.product_name,
      sku: json.sku,
      price: json.price,
      sale_price: json.sale_price,
      is_active: json.is_active,
      category_name: json.category?.category_name || null,
      primary_image: json.images?.[0]?.image_url || null,
      wishlist_count: countMap[json.product_id] || 0,
    };
  });

  // Step 4: Sort the results
  formattedProducts.sort((a, b) => {
    let aVal = a[validSortBy];
    let bVal = b[validSortBy];
    
    // Handle numeric vs string comparison
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal?.toLowerCase() || "";
    }
    
    if (validSortOrder === "ASC") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Step 5: Apply pagination
  const total = formattedProducts.length;
  const paginatedProducts = formattedProducts.slice(offset, offset + limit);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

///////////////////////////////////////////////////////////////////////
// ===== Get Users Who Have Product In Wishlist ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Retrieves all users who have a specific product in their wishlist
 * @param {string} productId - The product's ID
 * @returns {Promise<Array>} Array of users with wishlist details
 */
const getUsersWithProductInWishlist = async (productId) => {
  const wishlists = await Wishlist.findAll({
    where: { product_id: productId },
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "user_id",
          "user_nickname",
          "user_firstname",
          "user_lastname",
          "user_email",
          "user_avatar",
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return wishlists.map((w) => ({
    ...w.user.toJSON(),
    added_at: w.created_at,
  }));
};

///////////////////////////////////////////////////////////////////////
// ===== Get Wishlist Count For Single Product ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Gets the wishlist count for a specific product
 * @param {string} productId - The product's ID
 * @returns {Promise<number>} Count of users who have product in wishlist
 */
const getProductWishlistCount = async (productId) => {
  const count = await Wishlist.count({
    where: { product_id: productId },
  });

  return count;
};

///////////////////////////////////////////////////////////////////////
// ===== Get Total Wishlist Stats ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Gets overall wishlist statistics for admin dashboard
 * @returns {Promise<Object>} Wishlist statistics
 */
const getWishlistStats = async () => {
  const [totalItems, productsWishlisted, usersWithWishlists] = await Promise.all([
    // Total wishlist items
    Wishlist.count(),
    
    // Distinct products wishlisted
    Wishlist.count({
      distinct: true,
      col: "product_id",
    }),
    
    // Distinct users with wishlists
    Wishlist.count({
      distinct: true,
      col: "user_id",
    }),
  ]);

  return {
    total_wishlist_items: totalItems,
    products_wishlisted: productsWishlisted,
    users_with_wishlists: usersWithWishlists,
  };
};

///////////////////////////////////////////////////////////////////////
// ===== Remove Item From User's Wishlist (Admin Action) ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Admin action to remove a product from a user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID
 * @returns {Promise<Object>} Result of deletion
 */
const removeUserWishlistItem = async (userId, productId) => {
  const deleted = await Wishlist.destroy({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  return { deleted: deleted > 0, affectedRows: deleted };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllProductsWithWishlistCounts,
  getUsersWithProductInWishlist,
  getProductWishlistCount,
  getWishlistStats,
  removeUserWishlistItem,
};
