///////////////////////////////////////////////////////////////////////
// ====================== GET USER ORDERS ============================ //
///////////////////////////////////////////////////////////////////////

// This function fetches the current user's orders

//  ========== Module imports  ========== //
import axios from "axios";
import { ORDER_ENDPOINTS } from "../constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// =================== GET USER ORDERS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches the current user's orders
 * @param {number} limit - Maximum number of orders to fetch
 * @param {number} offset - Number of orders to skip
 * @returns {Promise<Object>} User's orders
 */
export default async function getUserOrders(limit = 10, offset = 0) {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET_ORDERS, {
      params: { limit, offset },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
}
