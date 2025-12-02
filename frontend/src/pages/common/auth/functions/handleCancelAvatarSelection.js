//////////////////////////////////////////////////////
// ===== HANDLE CANCEL AVATAR SELECTION =========== //
//////////////////////////////////////////////////////

// This function handles the cancellation of avatar file selection
// Resets the pending upload states without affecting default avatar

// ======= Asset Imports ======= //

const DEFAULT_AVATAR = "/assets/common/default-avatar.png";

/**
 * Handles the cancellation of avatar file selection
 * Resets the pending upload states without affecting stored avatar
 * 
 * @param {Function} setAvatar - Function to set avatar state
 * @param {Function} setAvatarPreview - Function to set avatar preview state
 * @param {Function} setPendingUpload - Function to set pending upload state
 * @param {string} storedAvatarPath - The stored avatar path from server
 * @returns {void}
 */

// ======= handleCancelAvatarSelection Function ======= //

const handleCancelAvatarSelection = (
  setAvatar,
  setAvatarPreview,
  setPendingUpload,
  storedAvatarPath = null
) => {
  setAvatar(null);
  setAvatarPreview(storedAvatarPath || DEFAULT_AVATAR);
  setPendingUpload(false);
  const avatarInput = document.getElementById("avatar-upload");
  if (avatarInput) {
    avatarInput.value = "";
  }
};

export default handleCancelAvatarSelection;
