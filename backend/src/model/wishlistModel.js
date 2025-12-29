///////////////////////////////////////////////
// ========== WISHLIST MODEL ============== ///
///////////////////////////////////////////////

// Model for wishlist database operations
// Uses callback-based pattern for MySQL operations

const { v4: uuidv4 } = require("uuid");
const db = require("../config/config").db;

/////////////////////////////////////////////////
// ===== Get User's Wishlist with Details ===== //
/////////////////////////////////////////////////

/**
 * Retrieves all wishlist items for a specific user with product details
 * @param {string} userId - The user's ID
 * @param {Function} callback - Callback function (error, results)
 */
const getUserWishlist = (userId, callback) => {
  const query = `
    SELECT 
      w.wishlist_id,
      w.user_id,
      w.product_id,
      w.created_at,
      p.product_name,
      p.product_description,
      p.product_slug,
      p.price,
      p.sale_price,
      p.sku,
      p.is_active,
      c.category_name,
      i.quantity_available,
      (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as primary_image
    FROM wishlist w
    INNER JOIN products p ON w.product_id = p.product_id
    LEFT JOIN product_categories c ON p.category_id = c.category_id
    LEFT JOIN inventory i ON p.product_id = i.product_id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `;

  db.query(query, [userId], callback);
};

//////////////////////////////////////////////////
// ===== Add Product to User's Wishlist ===== //
//////////////////////////////////////////////////

/**
 * Adds a product to the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID
 * @param {Function} callback - Callback function (error, results)
 */
const addToWishlist = (userId, productId, callback) => {
  const wishlistId = uuidv4();

  const query = `
    INSERT INTO wishlist (wishlist_id, user_id, product_id)
    VALUES (?, ?, ?)
  `;

  db.query(query, [wishlistId, userId, productId], callback);
};

//////////////////////////////////////////////////////
// ===== Remove Product from User's Wishlist ===== //
//////////////////////////////////////////////////////

/**
 * Removes a product from the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID to remove
 * @param {Function} callback - Callback function (error, results)
 */
const removeFromWishlist = (userId, productId, callback) => {
  const query = `
    DELETE FROM wishlist
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], callback);
};

/////////////////////////////////////////////////////////
// ===== Check if Product is in User's Wishlist ===== //
/////////////////////////////////////////////////////////

/**
 * Checks if a specific product is in the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID to check
 * @param {Function} callback - Callback function (error, results)
 */
const isInWishlist = (userId, productId, callback) => {
  const query = `
    SELECT wishlist_id
    FROM wishlist
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [userId, productId], callback);
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
};
