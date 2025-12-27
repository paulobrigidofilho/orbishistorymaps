///////////////////////////////////////////////////////////////////////
// ===================== GET USER ORDERS ============================= //
///////////////////////////////////////////////////////////////////////

// This function gets user's order history

//  ========== Module imports  ========== //
import axios from "axios";
import { API_BASE } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// =================== GET USER ORDERS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get user's order history
 * @returns {Promise} - API response with orders array
 */
export default async function getUserOrders() {
  try {
    const response = await axios.get(`${API_BASE}/api/orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || error;
  }
}
