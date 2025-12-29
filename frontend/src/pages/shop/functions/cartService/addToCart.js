///////////////////////////////////////////////////////////////////////
// ======================== ADD TO CART ============================== //
///////////////////////////////////////////////////////////////////////

// This function adds a product to the shopping cart

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ===================== ADD TO CART FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Adds a product to the shopping cart
 * @param {string} productId - Product UUID
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise<Object>} Updated cart item
 */
export default async function addToCart(productId, quantity = 1) {
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
}
