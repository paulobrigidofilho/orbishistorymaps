///////////////////////////////////////////////
// ======== ADMIN WISHLIST SERVICE ======== ///
///////////////////////////////////////////////

// Service layer for admin wishlist operations
// Provides wishlist statistics and user details per product

// ======= Module Imports ======= //
const db = require("../config/config").db;

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

///////////////////////////////////////////////////////////////////////
// ===== Get All Products With Wishlist Counts (Paginated) ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Retrieves paginated list of products with wishlist counts
 * @param {Object} filters - Pagination and filter options
 * @returns {Promise<Object>} Products with wishlist data and pagination
 */
const getAllProductsWithWishlistCounts = async (filters = {}) => {
  return new Promise((resolve, reject) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      sortBy = "wishlist_count",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;

    // Build WHERE clause for search
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push(
        "(p.product_name LIKE ? OR p.sku LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

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

    // Count query - only products that have been wishlisted
    const countQuery = `
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM products p
      INNER JOIN wishlist w ON p.product_id = w.product_id
      ${whereClause}
    `;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;

      // Main query - products with wishlist counts
      const productsQuery = `
        SELECT 
          p.product_id,
          p.product_name,
          p.sku,
          p.price,
          p.sale_price,
          p.is_active,
          c.category_name,
          COUNT(w.wishlist_id) as wishlist_count,
          (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as primary_image
        FROM products p
        INNER JOIN wishlist w ON p.product_id = w.product_id
        LEFT JOIN product_categories c ON p.category_id = c.category_id
        ${whereClause}
        GROUP BY p.product_id
        ORDER BY ${validSortBy} ${validSortOrder}
        LIMIT ? OFFSET ?
      `;

      const productsParams = [...queryParams, limit, offset];

      db.query(productsQuery, productsParams, (err, products) => {
        if (err) return reject(err);

        resolve({
          products,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    });
  });
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
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.user_id,
        u.user_nickname,
        u.user_firstname,
        u.user_lastname,
        u.user_email,
        u.user_avatar,
        w.created_at as added_at
      FROM wishlist w
      INNER JOIN users u ON w.user_id = u.user_id
      WHERE w.product_id = ?
      ORDER BY w.created_at DESC
    `;

    db.query(query, [productId], (err, users) => {
      if (err) return reject(err);
      resolve(users);
    });
  });
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
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as count
      FROM wishlist
      WHERE product_id = ?
    `;

    db.query(query, [productId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0].count);
    });
  });
};

///////////////////////////////////////////////////////////////////////
// ===== Get Total Wishlist Stats ===== //
///////////////////////////////////////////////////////////////////////

/**
 * Gets overall wishlist statistics for admin dashboard
 * @returns {Promise<Object>} Wishlist statistics
 */
const getWishlistStats = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(DISTINCT wishlist_id) as total_wishlist_items,
        COUNT(DISTINCT product_id) as products_wishlisted,
        COUNT(DISTINCT user_id) as users_with_wishlists
      FROM wishlist
    `;

    db.query(query, [], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
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
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM wishlist
      WHERE user_id = ? AND product_id = ?
    `;

    db.query(query, [userId, productId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getAllProductsWithWishlistCounts,
  getUsersWithProductInWishlist,
  getProductWishlistCount,
  getWishlistStats,
  removeUserWishlistItem,
};
