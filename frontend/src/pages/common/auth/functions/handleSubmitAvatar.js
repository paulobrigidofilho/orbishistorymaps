///////////////////////////////////////////////
// ===== HANDLE SUBMIT AVATAR FUNCTION ===== //
///////////////////////////////////////////////

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

// ======= handleSubmitAvatar Function ======= //

const handleSubmitAvatar = async (avatarFile, userId, setters) => {
  if (!avatarFile) {
    setters.setAvatarError("No file selected");
    return;
  }

  if (!userId) {
    setters.setAvatarError("No user ID provided for avatar upload");
    console.error("handleSubmitAvatar: Missing userId");
    return;
  }

  try {
    setters.setAvatarUploading(true); // Add loading state
    setters.setAvatarError("");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const uploadUrl = `${API_BASE}/api/avatar/${userId}`;
    console.log("Uploading avatar to:", uploadUrl);

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      const newAvatarPath = response.data.avatar || response.data.avatarPath;

      setters.setPendingUpload(false);
      setters.setAvatarUploading(false);
      setters.setAvatarUploadSuccess(true);
      setters.setAvatar(null); // Clear file object
      setters.setAvatarPreview(newAvatarPath); // Set server path
      setters.setStoredAvatarPath(newAvatarPath); // Store the path

      // Fade out success message after 3 seconds
      setTimeout(() => {
        setters.setAvatarUploadSuccess(false);
      }, 3000);
    }
  } catch (error) {
    setters.setAvatarUploading(false);
    setters.setAvatarError(
      "Upload failed: " +
        (error.response?.data?.message || error.message)
    );
    console.error("Avatar upload error:", error);
  }
};

export default handleSubmitAvatar;
