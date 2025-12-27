///////////////////////////////////////////////////////////////////////
// ===================== REMOVE CART ITEM ============================ //
///////////////////////////////////////////////////////////////////////

// This function removes an item from the shopping cart

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// =================== REMOVE CART ITEM FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Removes an item from the shopping cart
 * @param {string} cartItemId - Cart item UUID
 * @returns {Promise<Object>} Success message
 */
export default async function removeCartItem(cartItemId) {
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
}
