///////////////////////////////////////////////////////////////////////
// ======================= ORDER SERVICE ============================= //
///////////////////////////////////////////////////////////////////////

// This service handles order-related API calls

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { API_BASE } from "../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ======================= ORDER FUNCTIONS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Create a new order
 * @param {Object} orderData - Order details including address, payment, items
 * @returns {Promise} - API response with order data
 */
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/orders`, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get user's order history
 * @returns {Promise} - API response with orders array
 */
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get specific order details
 * @param {number} orderId - Order ID
 * @returns {Promise} - API response with order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE}/api/orders/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error.response?.data || error;
  }
};
