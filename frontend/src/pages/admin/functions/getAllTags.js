///////////////////////////////////////////////////////////////////////
// =================== GET ALL TAGS FUNCTION ========================= //
///////////////////////////////////////////////////////////////////////

// This function fetches all unique tags across products (for autocomplete)

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== GET ALL TAGS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get all unique tags (for autocomplete suggestions)
 * @returns {Promise<Object>} Response with tags array including usage counts
 */
export default async function getAllTags() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/tags`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tags");
  }
}
