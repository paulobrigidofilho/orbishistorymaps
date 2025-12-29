///////////////////////////////////////////////
// ========== WISHLIST SERVICE ============ ///
///////////////////////////////////////////////

// Service layer for wishlist business logic
// Wraps model callbacks in Promises for async/await usage in controllers

const wishlistModel = require("../model/wishlistModel");

/////////////////////////////////////////////////
// ===== Get User's Wishlist with Details ===== //
/////////////////////////////////////////////////

/**
 * Retrieves all wishlist items for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of wishlist items with product details
 */
const getUserWishlist = (userId) => {
  return new Promise((resolve, reject) => {
    wishlistModel.getUserWishlist(userId, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//////////////////////////////////////////////////
// ===== Add Product to User's Wishlist ===== //
//////////////////////////////////////////////////

/**
 * Adds a product to the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID
 * @returns {Promise<Object>} Database operation result
 */
const addToWishlist = (userId, productId) => {
  return new Promise((resolve, reject) => {
    wishlistModel.addToWishlist(userId, productId, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

//////////////////////////////////////////////////////
// ===== Remove Product from User's Wishlist ===== //
//////////////////////////////////////////////////////

/**
 * Removes a product from the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID to remove
 * @returns {Promise<Object>} Database operation result
 */
const removeFromWishlist = (userId, productId) => {
  return new Promise((resolve, reject) => {
    wishlistModel.removeFromWishlist(userId, productId, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

/////////////////////////////////////////////////////////
// ===== Check if Product is in User's Wishlist ===== //
/////////////////////////////////////////////////////////

/**
 * Checks if a specific product is in the user's wishlist
 * @param {string} userId - The user's ID
 * @param {string} productId - The product's ID to check
 * @returns {Promise<boolean>} True if product is in wishlist, false otherwise
 */
const isInWishlist = (userId, productId) => {
  return new Promise((resolve, reject) => {
    wishlistModel.isInWishlist(userId, productId, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
};
