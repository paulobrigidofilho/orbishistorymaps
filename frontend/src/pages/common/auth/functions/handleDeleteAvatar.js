/**
 * Handles the deletion of avatar
 * Resets the avatar and preview states
 * 
 * @param {Function} setAvatar - Function to set avatar state
 * @param {Function} setAvatarPreview - Function to set avatar preview state
 * @returns {void}
 */
const handleDeleteAvatar = (setAvatar, setAvatarPreview) => {
  setAvatar(null);
  setAvatarPreview(null);
  const avatarInput = document.getElementById("avatar-upload");
  if (avatarInput) {
    avatarInput.value = "";
  }
};

export default handleDeleteAvatar;
