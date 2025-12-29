///////////////////////////////////////////////////////////////////////
// ============= UPLOAD USER AVATAR (ADMIN) FUNCTION ================ //
///////////////////////////////////////////////////////////////////////

// This function handles avatar upload for admin user management
// Uses the existing avatar API endpoint

//  ========== Module imports  ========== //
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ====================== UPLOAD USER AVATAR ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Upload avatar for a user (admin operation)
 * @param {string} userId - The user ID to upload avatar for
 * @param {File} avatarFile - The avatar file to upload
 * @returns {Promise<Object>} Response with new avatar path
 */
export default async function uploadUserAvatar(userId, avatarFile) {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.post(
      `${API_BASE_URL}/api/avatar/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload avatar"
    );
  }
}
