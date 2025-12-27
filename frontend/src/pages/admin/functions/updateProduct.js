///////////////////////////////////////////////////////////////////////
// =================== UPDATE PRODUCT FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

// This function updates an existing product

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== UPDATE PRODUCT ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Update product
 */
export default async function updateProduct(productId, productData) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/admin/products/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
}
