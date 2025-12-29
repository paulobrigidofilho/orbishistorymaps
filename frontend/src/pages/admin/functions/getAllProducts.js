///////////////////////////////////////////////////////////////////////
// ================== GET ALL PRODUCTS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all products with pagination and filters

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ===================== GET ALL PRODUCTS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get all products with pagination and filters
 */
export default async function getAllProducts(params = {}) {
  try {
    // Clean up empty string values
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const response = await axios.get(`${API_BASE_URL}/api/admin/products`, { params: cleanParams });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
}
