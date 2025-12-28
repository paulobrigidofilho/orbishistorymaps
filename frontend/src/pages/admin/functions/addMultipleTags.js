///////////////////////////////////////////////////////////////////////
// =================== ADD MULTIPLE TAGS FUNCTION ==================== //
///////////////////////////////////////////////////////////////////////

// This function adds multiple tags to a product at once

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== ADD MULTIPLE TAGS ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Add multiple tags to a product
 * @param {string} productId - The product ID
 * @param {string[]} tags - Array of tag names to add
 * @returns {Promise<Object>} Response with created tags
 */
export default async function addMultipleTags(productId, tags) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/products/${productId}/tags/bulk`, {
      tags,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add tags");
  }
}
