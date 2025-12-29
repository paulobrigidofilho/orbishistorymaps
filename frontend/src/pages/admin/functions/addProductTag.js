///////////////////////////////////////////////////////////////////////
// =================== ADD PRODUCT TAG FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// This function adds a tag to a product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== ADD PRODUCT TAG ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Add a single tag to a product
 * @param {string} productId - The product ID
 * @param {string} tagName - The tag name to add
 * @returns {Promise<Object>} Response with created tag
 */
export default async function addProductTag(productId, tagName) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/products/${productId}/tags`, {
      tagName,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add tag");
  }
}
