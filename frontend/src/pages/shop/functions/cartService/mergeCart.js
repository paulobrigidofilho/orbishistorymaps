///////////////////////////////////////////////////////////////////////
// ========================= MERGE CART ============================== //
///////////////////////////////////////////////////////////////////////

// This function merges guest cart with user cart after login

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ==================== MERGE CART FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Merges guest cart with authenticated user's cart
 * Called after successful login/registration
 * @returns {Promise<Object>} Result of merge operation
 */
export default async function mergeCart() {
  try {
    const response = await axios.post(
      SHOP_ENDPOINTS.MERGE_CART,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error merging cart:", error);
    // Don't throw - cart merge failure shouldn't block login
    return { success: false, message: error.message };
  }
}
