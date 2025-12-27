///////////////////////////////////////////////////////////////////////
// =================== DELETE PRODUCT FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function soft deletes a product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== DELETE PRODUCT ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Delete product (soft delete)
 */
export default async function deleteProduct(productId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete product");
  }
}
