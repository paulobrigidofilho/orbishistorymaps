///////////////////////////////////////////////////////////////////////
// =============== DELETE PRODUCT IMAGE FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

// This function deletes a product image

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ==================== DELETE PRODUCT IMAGE ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Delete product image
 */
export default async function deleteProductImage(imageId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/admin/products/images/${imageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete image");
  }
}
