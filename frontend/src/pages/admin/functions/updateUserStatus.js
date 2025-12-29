///////////////////////////////////////////////////////////////////////
// ================ UPDATE USER STATUS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// This function updates a user's status

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ===================== UPDATE USER STATUS ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Update user status
 */
export default async function updateUserStatus(userId, status) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user status");
  }
}
