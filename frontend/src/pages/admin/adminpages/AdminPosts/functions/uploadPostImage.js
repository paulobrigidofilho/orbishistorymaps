///////////////////////////////////////////////////////////////////////
// ================== UPLOAD POST IMAGE FUNCTION ==================== //
///////////////////////////////////////////////////////////////////////

// This function uploads an image for a post

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== UPLOAD POST IMAGE FUNCTION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * Upload an image for a post
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} Upload result with imageUrl
 */
export const uploadPostImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(`${API_BASE_URL}${POST_API.UPLOAD_IMAGE}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default uploadPostImage;
