///////////////////////////////////////////////////////////////////////
// ================== GET ADMIN STATS FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function fetches admin dashboard statistics

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== GET ADMIN STATS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get admin dashboard statistics
 */
export default async function getAdminStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch stats");
  }
}
