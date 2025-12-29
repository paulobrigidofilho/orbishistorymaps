///////////////////////////////////////////////////////////////////////
// =================== ADD TO WISHLIST =============================== //
///////////////////////////////////////////////////////////////////////

// This function adds a product to the user's wishlist

//  ========== Module imports  ========== //
import axios from "axios";
import { WISHLIST_ENDPOINTS } from "../constants/wishlistConstants";

///////////////////////////////////////////////////////////////////////
// ================ ADD TO WISHLIST FUNCTION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Adds a product to the user's wishlist
 * @param {string} productId - Product UUID
 * @returns {Promise<Object>} Success response
 */
export default async function addToWishlist(productId) {
  try {
    const response = await axios.post(
      WISHLIST_ENDPOINTS.ADD_TO_WISHLIST,
      { productId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add item to wishlist"
    );
  }
}
