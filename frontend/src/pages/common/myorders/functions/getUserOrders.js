///////////////////////////////////////////////////////////////////////
// ====================== GET USER ORDERS =========================== //
///////////////////////////////////////////////////////////////////////

// This function fetches the current user's orders from the API
// Uses session-based authentication via withCredentials

///////////////////////////////////////////////////////////////////////
// =================== MODULE IMPORTS =============================== //
///////////////////////////////////////////////////////////////////////

import axios from "axios";
import { ORDER_ENDPOINTS, ORDER_ERROR_MESSAGES } from "../constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// =================== GET USER ORDERS FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches the current user's orders with pagination support
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of orders to fetch (default: 10)
 * @param {number} options.offset - Number of orders to skip (default: 0)
 * @param {string} options.status - Filter by order status (optional)
 * @returns {Promise<Object>} Response containing orders array and pagination info
 * @throws {Error} If the API request fails
 *
 * @example
 * // Fetch first 10 orders
 * const orders = await getUserOrders();
 *
 * @example
 * // Fetch orders with pagination
 * const orders = await getUserOrders({ limit: 20, offset: 10 });
 */
export async function getUserOrders({ limit = 10, offset = 0, status } = {}) {
  try {
    // ===== Build query parameters ===== //
    const params = { limit, offset };
    if (status) {
      params.status = status;
    }

    // ===== Make API request ===== //
    const response = await axios.get(ORDER_ENDPOINTS.GET_ORDERS, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      error.response?.data?.message || ORDER_ERROR_MESSAGES.FETCH_FAILED
    );
  }
}

// ===== Default export for convenience ===== //
export default getUserOrders;
