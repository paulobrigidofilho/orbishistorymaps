///////////////////////////////////////////////////////////////////////
// =================== CREATE PRODUCT FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function creates a new product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== CREATE PRODUCT ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Create new product
 */
export default async function createProduct(productData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/products`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
}
