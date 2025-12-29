///////////////////////////////////////////////////////////////////////
// =============== UPLOAD PRODUCT IMAGE FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

// This function uploads a product image

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ==================== UPLOAD PRODUCT IMAGE ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Upload product image
 */
export default async function uploadProductImage(productId, imageFile, isPrimary = false) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("isPrimary", isPrimary);

    const response = await axios.post(
      `${API_BASE_URL}/api/admin/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
}
