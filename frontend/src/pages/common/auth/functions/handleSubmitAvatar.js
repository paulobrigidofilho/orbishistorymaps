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
import { SUCCESS_MESSAGE_DURATION, API_BASE } from "../constants/authConstants";
import { AVATAR_ERRORS } from "../constants/authErrorMessages";

// ======= handleSubmitAvatar Function ======= //

const handleSubmitAvatar = async (avatarFile, userId, setters) => {
  if (!avatarFile) {
    setters.setAvatarError(AVATAR_ERRORS.NO_FILE_SELECTED);
    return;
  }

  if (!userId) {
    setters.setAvatarError(AVATAR_ERRORS.NO_USER_ID);
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
      }, SUCCESS_MESSAGE_DURATION);
    }
  } catch (error) {
    setters.setAvatarUploading(false);
    setters.setAvatarError(
      `${AVATAR_ERRORS.UPLOAD_FAILED}: ${error.response?.data?.message || error.message}`
    );
    console.error("Avatar upload error:", error);
  }
};

export default handleSubmitAvatar;
