///////////////////////////////////////////////////////////////////////
// =================== GET PRODUCT TAGS FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all tags for a specific product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== GET PRODUCT TAGS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get all tags for a product
 * @param {string} productId - The product ID
 * @returns {Promise<Object>} Response with tags array
 */
export default async function getProductTags(productId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/products/${productId}/tags`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product tags");
  }
}
