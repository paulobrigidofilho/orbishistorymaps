///////////////////////////////////////////////////////////////////////
// ========================= GET CART ================================ //
///////////////////////////////////////////////////////////////////////

// This function fetches the current user's shopping cart

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ======================= GET CART FUNCTION ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches the current user's shopping cart
 * @returns {Promise<Object>} Cart with items and totals
 */
export default async function getCart() {
  try {
    const response = await axios.get(SHOP_ENDPOINTS.GET_CART, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch cart");
  }
}
