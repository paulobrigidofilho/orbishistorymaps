///////////////////////////////////////////////////////////////////////
// ======================== CART SERVICE ============================= //
///////////////////////////////////////////////////////////////////////

// This service handles all shopping cart API requests

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// =========================== GET CART ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches the current user's shopping cart
 * @returns {Promise<Object>} Cart with items and totals
 */
export const getCart = async () => {
  try {
    const response = await axios.get(SHOP_ENDPOINTS.GET_CART, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch cart");
  }
};

///////////////////////////////////////////////////////////////////////
// ========================= ADD TO CART ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Adds a product to the shopping cart
 * @param {string} productId - Product UUID
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise<Object>} Updated cart item
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      SHOP_ENDPOINTS.ADD_TO_CART,
      { productId, quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add item to cart"
    );
  }
};

///////////////////////////////////////////////////////////////////////
// ===================== UPDATE CART ITEM ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Updates the quantity of a cart item
 * @param {string} cartItemId - Cart item UUID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart item
 */
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await axios.put(
      SHOP_ENDPOINTS.UPDATE_CART_ITEM(cartItemId),
      { quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update cart item"
    );
  }
};

///////////////////////////////////////////////////////////////////////
// ===================== REMOVE CART ITEM ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Removes an item from the shopping cart
 * @param {string} cartItemId - Cart item UUID
 * @returns {Promise<Object>} Success message
 */
export const removeCartItem = async (cartItemId) => {
  try {
    const response = await axios.delete(
      SHOP_ENDPOINTS.REMOVE_CART_ITEM(cartItemId),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove cart item"
    );
  }
};

///////////////////////////////////////////////////////////////////////
// ========================= CLEAR CART ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Clears all items from the shopping cart
 * @param {string} cartId - Cart UUID
 * @returns {Promise<Object>} Success message
 */
export const clearCart = async (cartId) => {
  try {
    const response = await axios.delete(SHOP_ENDPOINTS.CLEAR_CART(cartId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error(error.response?.data?.message || "Failed to clear cart");
  }
};
