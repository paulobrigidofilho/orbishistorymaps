///////////////////////////////////////////////////////////////////////
// ========================= CLEAR CART ============================== //
///////////////////////////////////////////////////////////////////////

// This function clears all items from the shopping cart

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ====================== CLEAR CART FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Clears all items from the shopping cart
 * @param {string} cartId - Cart UUID
 * @returns {Promise<Object>} Success message
 */
export default async function clearCart(cartId) {
  try {
    const response = await axios.delete(SHOP_ENDPOINTS.CLEAR_CART(cartId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error(error.response?.data?.message || "Failed to clear cart");
  }
}
