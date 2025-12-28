///////////////////////////////////////////////////////////////////////
// ====================== UPDATE USER FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function updates user information (partial updates supported)

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== UPDATE USER FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Update user profile information
 * Admin can update any user including their own profile
 */
export default async function updateUser(userId, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}`, updates);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
}
