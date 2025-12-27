///////////////////////////////////////////////////////////////////////
// =================== GET USER BY ID FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function fetches a single user by ID

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ======================= GET USER BY ID =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get single user by ID
 */
export default async function getUserById(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
}
