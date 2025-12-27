//////////////////////////////////////////////////
// =============== CART SERVICE ================ //
//////////////////////////////////////////////////

// This service handles shopping cart business logic

// ======= Module Imports ======= //
const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");

// ======= Constants Imports ======= //
const { CART_ERRORS } = require("../constants/errorMessages");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== getCart Function ===== //
// Retrieves or creates a cart for a user/session

const getCart = async (userId, sessionId) => {
  return new Promise((resolve, reject) => {
    cartModel.getOrCreateCart(userId, sessionId, (err, cart) => {
      if (err) {
        return reject(new Error(CART_ERRORS.FETCH_FAILED));
      }

      // Get cart items
      cartModel.getCartItems(cart.cart_id, (err, items) => {
        if (err) {
          return reject(new Error(CART_ERRORS.FETCH_FAILED));
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => {
          const price = item.sale_price || item.current_price;
          return sum + price * item.quantity;
        }, 0);

        resolve({
          cart_id: cart.cart_id,
          items,
          item_count: items.length,
          total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: subtotal.toFixed(2),
          created_at: cart.created_at,
          updated_at: cart.updated_at,
        });
      });
    });
  });
};

// ===== addToCart Function ===== //
// Adds a product to the cart

const addToCart = async (userId, sessionId, productId, quantity = 1) => {
  return new Promise((resolve, reject) => {
    // Verify product exists and is available
    productModel.getProductById(productId, (err, product) => {
      if (err || !product) {
        return reject(new Error(CART_ERRORS.PRODUCT_NOT_FOUND));
      }

      if (!product.is_active) {
        return reject(new Error(CART_ERRORS.PRODUCT_UNAVAILABLE));
      }

      // Get or create cart
      cartModel.getOrCreateCart(userId, sessionId, (err, cart) => {
        if (err) {
          return reject(new Error(CART_ERRORS.ADD_FAILED));
        }

        const { v4: uuidv4 } = require("uuid");
        const cartItemData = {
          cart_item_id: uuidv4(),
          cart_id: cart.cart_id,
          product_id: productId,
          quantity,
          price_at_addition: product.sale_price || product.price,
        };

        cartModel.addCartItem(cartItemData, (err, result) => {
          if (err) {
            return reject(new Error(CART_ERRORS.ADD_FAILED));
          }

          resolve({ message: "Product added to cart", cart_id: cart.cart_id });
        });
      });
    });
  });
};

// ===== updateCartItem Function ===== //
// Updates the quantity of a cart item

const updateCartItem = async (cartItemId, quantity) => {
  if (quantity < 1) {
    return Promise.reject(new Error(CART_ERRORS.INVALID_QUANTITY));
  }

  return new Promise((resolve, reject) => {
    cartModel.updateCartItemQuantity(cartItemId, quantity, (err, result) => {
      if (err) {
        return reject(new Error(CART_ERRORS.UPDATE_FAILED));
      }

      if (result.affectedRows === 0) {
        return reject(new Error(CART_ERRORS.ITEM_NOT_FOUND));
      }

      resolve({ message: "Cart item updated" });
    });
  });
};

// ===== removeFromCart Function ===== //
// Removes an item from the cart

const removeFromCart = async (cartItemId) => {
  return new Promise((resolve, reject) => {
    cartModel.removeCartItem(cartItemId, (err, result) => {
      if (err) {
        return reject(new Error(CART_ERRORS.REMOVE_FAILED));
      }

      if (result.affectedRows === 0) {
        return reject(new Error(CART_ERRORS.ITEM_NOT_FOUND));
      }

      resolve({ message: "Item removed from cart" });
    });
  });
};

// ===== clearCart Function ===== //
// Clears all items from the cart

const clearCart = async (cartId) => {
  return new Promise((resolve, reject) => {
    cartModel.clearCart(cartId, (err, result) => {
      if (err) {
        return reject(new Error(CART_ERRORS.CLEAR_FAILED));
      }

      resolve({ message: "Cart cleared" });
    });
  });
};

// ===== mergeGuestCart Function ===== //
// Merges a guest cart with user cart after login

const mergeGuestCart = async (sessionId, userId) => {
  return new Promise((resolve, reject) => {
    cartModel.mergeGuestCartToUser(sessionId, userId, (err, result) => {
      if (err) {
        console.error("Cart merge failed:", err);
        return reject(new Error(CART_ERRORS.MERGE_FAILED));
      }

      resolve({ message: "Cart merged successfully" });
    });
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
