///////////////////////////////////////////////////////////////////////
// ======================= CREATE ORDER ============================== //
///////////////////////////////////////////////////////////////////////

// This function creates a new order

//  ========== Module imports  ========== //
import axios from "axios";
import { API_BASE } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ===================== CREATE ORDER FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Create a new order
 * @param {Object} orderData - Order details including address, payment, items
 * @returns {Promise} - API response with order data
 */
export default async function createOrder(orderData) {
  try {
    const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error.response?.data || error;
  }
}
