///////////////////////////////////////////////////////////////////////
// ====================== GET WISHLIST =============================== //
///////////////////////////////////////////////////////////////////////

// This function fetches the current user's wishlist

//  ========== Module imports  ========== //
import axios from "axios";
import { WISHLIST_ENDPOINTS } from "../constants/wishlistConstants";

///////////////////////////////////////////////////////////////////////
// =================== GET WISHLIST FUNCTION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches the current user's wishlist with product details
 * @returns {Promise<Object>} Wishlist items with product information
 */
export default async function getUserWishlist() {
  try {
    const response = await axios.get(WISHLIST_ENDPOINTS.GET_WISHLIST, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch wishlist"
    );
  }
}
