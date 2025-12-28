///////////////////////////////////////////////////////////////////////
// =================== DELETE PRODUCT TAG FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function deletes a tag from a product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== DELETE PRODUCT TAG ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Delete a tag from a product
 * @param {number} tagId - The tag ID to delete
 * @returns {Promise<Object>} Response confirming deletion
 */
export default async function deleteProductTag(tagId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/admin/tags/${tagId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete tag");
  }
}
