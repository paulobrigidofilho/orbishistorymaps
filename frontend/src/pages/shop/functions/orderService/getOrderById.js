///////////////////////////////////////////////////////////////////////
// ===================== GET ORDER BY ID ============================= //
///////////////////////////////////////////////////////////////////////

// This function gets specific order details

//  ========== Module imports  ========== //
import axios from "axios";
import { API_BASE } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// =================== GET ORDER BY ID FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get specific order details
 * @param {number} orderId - Order ID
 * @returns {Promise} - API response with order details
 */
export default async function getOrderById(orderId) {
  try {
    const response = await axios.get(`${API_BASE}/api/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error.response?.data || error;
  }
}
