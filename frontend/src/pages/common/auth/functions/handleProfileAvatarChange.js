//////////////////////////////////////////////
// ===== HANDLE PROFILE AVATAR CHANGE ===== //
//////////////////////////////////////////////

// This function handles the avatar file change event for profile page
// Validates file size and type before setting the avatar

/**
 * Handles avatar file selection in profile page
 * Validates and sets preview for pending upload
 *
 * @param {Event} e - File input change event
 * @param {Function} setAvatar - Function to set avatar file
 * @param {Function} setAvatarError - Function to set error message
 * @param {Function} setAvatarPreview - Function to set preview URL
 * @param {Function} setPendingUpload - Function to set pending upload state
 * @returns {void}
 */

// ======= Module Imports ======= //
import { validateAvatar } from "../validators/avatarValidator";

// ======= handleProfileAvatarChange Function ======= //
const handleProfileAvatarChange = (
  e,
  setAvatar,
  setAvatarError,
  setAvatarPreview,
  setPendingUpload
) => {
  const file = e.target.files[0];
  setAvatarError("");

  if (file) {
    // Use the validator to check the file
    const validation = validateAvatar(file);

    if (!validation.success) {
      setAvatarError(validation.error);
      e.target.value = "";
      return;
    }

    // If validation passes
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setPendingUpload(true);
  }
};

export default handleProfileAvatarChange;
