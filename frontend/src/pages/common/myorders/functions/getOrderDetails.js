///////////////////////////////////////////////////////////////////////
// ==================== GET ORDER DETAILS =========================== //
///////////////////////////////////////////////////////////////////////

// This function fetches detailed information for a specific order
// Includes order items, shipping info, and payment details

///////////////////////////////////////////////////////////////////////
// =================== MODULE IMPORTS =============================== //
///////////////////////////////////////////////////////////////////////

import axios from "axios";
import { ORDER_ENDPOINTS, ORDER_ERROR_MESSAGES } from "../constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// ================= GET ORDER DETAILS FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches detailed information for a specific order by ID
 * @param {string} orderId - The order UUID to fetch
 * @returns {Promise<Object>} Order details including items, shipping, and payment info
 * @throws {Error} If the order is not found or request fails
 *
 * @example
 * // Fetch order details
 * const details = await getOrderDetails("abc123-uuid");
 * console.log(details.items, details.total);
 */
export async function getOrderDetails(orderId) {
  // ===== Validate order ID ===== //
  if (!orderId) {
    throw new Error(ORDER_ERROR_MESSAGES.INVALID_ORDER_ID);
  }

  try {
    // ===== Make API request ===== //
    const response = await axios.get(ORDER_ENDPOINTS.GET_ORDER_DETAILS(orderId), {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);

    // ===== Handle specific error cases ===== //
    if (error.response?.status === 404) {
      throw new Error(ORDER_ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    throw new Error(
      error.response?.data?.message || ORDER_ERROR_MESSAGES.FETCH_FAILED
    );
  }
}

// ===== Default export for convenience ===== //
export default getOrderDetails;
