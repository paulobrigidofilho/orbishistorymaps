///////////////////////////////////////////////////////////////////////
// ================= GET PRODUCT BY ID FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// This function fetches a single product by ID

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ===================== GET PRODUCT BY ID ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get single product by ID
 */
export default async function getProductById(productId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
}
