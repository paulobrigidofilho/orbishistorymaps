// ======= Module imports ======= //
const db = require("../config/config").db;

///////////////////////////////////////////////////////////////////////
// ========================= CART MODEL ============================ //
///////////////////////////////////////////////////////////////////////

const cartModel = {
  ///////////////////////////////////////////////////////////////////////
  // ===================== GET OR CREATE CART ======================== //
  ///////////////////////////////////////////////////////////////////////

  getOrCreateCart: (userId, sessionId, callback) => {
    // Try to find existing cart
    const findQuery = userId
      ? `SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
      : `SELECT * FROM cart WHERE session_id = ? ORDER BY created_at DESC LIMIT 1`;

    db.query(findQuery, [userId || sessionId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      if (results.length > 0) {
        return callback(null, results[0]);
      }

      // Create new cart if none exists
      const { v4: uuidv4 } = require("uuid");
      const cartId = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const createQuery = `
        INSERT INTO cart (cart_id, user_id, session_id, expires_at)
        VALUES (?, ?, ?, ?)`;

      db.query(createQuery, [cartId, userId, sessionId, expiresAt], (err, result) => {
        if (err) {
          console.error("Database INSERT error:", err);
          return callback(err, null);
        }

        callback(null, {
          cart_id: cartId,
          user_id: userId,
          session_id: sessionId,
          expires_at: expiresAt,
        });
      });
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ===================== GET CART ITEMS ============================ //
  ///////////////////////////////////////////////////////////////////////

  getCartItems: (cartId, callback) => {
    const query = `
      SELECT 
        ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, ci.price_at_addition,
        p.product_name, p.product_slug, p.price as current_price, p.sale_price, p.is_active,
        i.quantity_available,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as primary_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE ci.cart_id = ?`;

    db.query(query, [cartId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ===================== ADD ITEM TO CART ========================== //
  ///////////////////////////////////////////////////////////////////////

  addCartItem: (cartItemData, callback) => {
    // Check if item already exists in cart
    const checkQuery = `
      SELECT * FROM cart_items 
      WHERE cart_id = ? AND product_id = ?`;

    db.query(checkQuery, [cartItemData.cart_id, cartItemData.product_id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      if (results.length > 0) {
        // Update quantity if item exists
        const updateQuery = `
          UPDATE cart_items 
          SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
          WHERE cart_id = ? AND product_id = ?`;

        db.query(
          updateQuery,
          [cartItemData.quantity, cartItemData.cart_id, cartItemData.product_id],
          (err, result) => {
            if (err) {
              console.error("Database UPDATE error:", err);
              return callback(err, null);
            }
            return callback(null, result);
          }
        );
      } else {
        // Insert new item
        const insertQuery = `
          INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity, price_at_addition)
          VALUES (?, ?, ?, ?, ?)`;

        db.query(
          insertQuery,
          [
            cartItemData.cart_item_id,
            cartItemData.cart_id,
            cartItemData.product_id,
            cartItemData.quantity,
            cartItemData.price_at_addition,
          ],
          (err, result) => {
            if (err) {
              console.error("Database INSERT error:", err);
              return callback(err, null);
            }
            return callback(null, result);
          }
        );
      }
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== UPDATE CART ITEM QUANTITY =================== //
  ///////////////////////////////////////////////////////////////////////

  updateCartItemQuantity: (cartItemId, quantity, callback) => {
    const query = `
      UPDATE cart_items 
      SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE cart_item_id = ?`;

    db.query(query, [quantity, cartItemId], (err, result) => {
      if (err) {
        console.error("Database UPDATE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== REMOVE ITEM FROM CART ======================= //
  ///////////////////////////////////////////////////////////////////////

  removeCartItem: (cartItemId, callback) => {
    const query = `DELETE FROM cart_items WHERE cart_item_id = ?`;

    db.query(query, [cartItemId], (err, result) => {
      if (err) {
        console.error("Database DELETE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ====================== CLEAR CART =============================== //
  ///////////////////////////////////////////////////////////////////////

  clearCart: (cartId, callback) => {
    const query = `DELETE FROM cart_items WHERE cart_id = ?`;

    db.query(query, [cartId], (err, result) => {
      if (err) {
        console.error("Database DELETE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== MERGE GUEST CART TO USER ==================== //
  ///////////////////////////////////////////////////////////////////////

  mergeGuestCartToUser: (sessionId, userId, callback) => {
    const query = `
      UPDATE cart 
      SET user_id = ?, session_id = NULL 
      WHERE session_id = ? AND user_id IS NULL`;

    db.query(query, [userId, sessionId], (err, result) => {
      if (err) {
        console.error("Database UPDATE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
};

module.exports = cartModel;
