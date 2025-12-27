///////////////////////////////////////////////////////////////////////
// =================== GET PRODUCT DETAILS =========================== //
///////////////////////////////////////////////////////////////////////

// This function fetches a single product by ID or slug

//  ========== Module imports  ========== //
import axios from "axios";
import { SHOP_ENDPOINTS } from "../../constants/shopConstants";

///////////////////////////////////////////////////////////////////////
// ================= GET PRODUCT DETAILS FUNCTION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches a single product by ID or slug
 * @param {string} identifier - Product ID (UUID) or slug
 * @returns {Promise<Object>} Product details with images
 */
export default async function getProductDetails(identifier) {
  try {
    const response = await axios.get(SHOP_ENDPOINTS.GET_PRODUCT(identifier), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details"
    );
  }
}
