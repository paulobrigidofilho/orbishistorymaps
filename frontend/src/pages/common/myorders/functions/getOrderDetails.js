///////////////////////////////////////////////////////////////////////
// ==================== GET ORDER DETAILS ============================ //
///////////////////////////////////////////////////////////////////////

// This function fetches details for a specific order

//  ========== Module imports  ========== //
import axios from "axios";
import { ORDER_ENDPOINTS } from "../constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// ================= GET ORDER DETAILS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches detailed information for a specific order
 * @param {string} orderId - Order UUID
 * @returns {Promise<Object>} Order details with items
 */
export default async function getOrderDetails(orderId) {
  try {
    const response = await axios.get(ORDER_ENDPOINTS.GET_ORDER_DETAILS(orderId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch order details"
    );
  }
}
