///////////////////////////////////////////////////////////////////////
// ===================== UPDATE CART ITEM ============================ //
///////////////////////////////////////////////////////////////////////

// This function updates the quantity of a cart item

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// =================== UPDATE CART ITEM FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Updates the quantity of a cart item
 * @param {string} cartItemId - Cart item UUID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart item
 */
export default async function updateCartItem(cartItemId, quantity) {
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
}
