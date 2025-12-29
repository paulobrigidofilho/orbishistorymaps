///////////////////////////////////////////////////////////////////////
// =================== GET ALL CATEGORIES FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all product categories

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== FETCH CATEGORIES =========================== //
///////////////////////////////////////////////////////////////////////

export default async function getAllCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/categories`);
    return response.data;
  } catch (error) {
    console.error("[getAllCategories] Error:", error);
    // Return empty data on error to prevent UI crash
    return { success: false, data: [] };
  }
}
