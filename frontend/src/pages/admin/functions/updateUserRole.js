///////////////////////////////////////////////////////////////////////
// ================= UPDATE USER ROLE FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function updates a user's role

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== UPDATE USER ROLE ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Update user role
 */
export default async function updateUserRole(userId, role) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user role");
  }
}
