//////////////////////////////////////
// ===== HANDLE UPLOAD AVATAR ===== //
//////////////////////////////////////

// This function handles the avatar upload process
// by making an API call to upload the avatar file

/**
 * Handles the avatar upload process
 * Makes API call to upload avatar and manages success state
 * 
 * @param {File} avatarFile - The avatar file to upload
 * @param {string} userId - The user ID
 * @param {Object} setters - Object containing state setter functions
 * @returns {Promise<void>}
 */

// ======= Module Imports ======= //

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

// ======= handleUploadAvatar Function ======= //

const handleUploadAvatar = async (avatarFile, userId, setters) => {
  if (!avatarFile) {
    setters.setAvatarError("No file selected");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.post(`${API_BASE}/api/avatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      setters.setPendingUpload(false);
      setters.setAvatarUploadSuccess(true);
      setters.setAvatarError("");
      
      // Update avatar with server response
      const returned = response.data.avatar || response.data.avatarPath;
      const newAvatarPath = returned?.startsWith("http")
        ? returned
        : `${API_BASE.replace(/\/+$/,"")}${returned || ""}`;
      setters.setAvatar(newAvatarPath);
      setters.setAvatarPreview(newAvatarPath);

      // Fade out success message after 3 seconds
      setTimeout(() => {
        setters.setAvatarUploadSuccess(false);
      }, 3000);
    }
  } catch (error) {
    setters.setAvatarError("Upload failed: " + (error.response?.data?.message || error.message));
  }
};

export default handleUploadAvatar;
