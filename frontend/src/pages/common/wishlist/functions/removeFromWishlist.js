///////////////////////////////////////////////////////////////////////
// ================ REMOVE FROM WISHLIST ============================= //
///////////////////////////////////////////////////////////////////////

// This function removes a product from the user's wishlist

//  ========== Module imports  ========== //
import axios from "axios";
import { WISHLIST_ENDPOINTS } from "../constants/wishlistConstants";

///////////////////////////////////////////////////////////////////////
// ============= REMOVE FROM WISHLIST FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Removes a product from the user's wishlist
 * @param {string} productId - Product UUID to remove
 * @returns {Promise<Object>} Success response
 */
export default async function removeFromWishlist(productId) {
  try {
    const response = await axios.delete(
      WISHLIST_ENDPOINTS.REMOVE_FROM_WISHLIST(productId),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove item from wishlist"
    );
  }
}
