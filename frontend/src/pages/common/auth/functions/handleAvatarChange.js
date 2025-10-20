/**
 * Handles the avatar file change event
 * Validates file size and type before setting the avatar
 * 
 * @param {Object} e - The event object from file input change
 * @param {Function} setAvatar - Function to set avatar state
 * @param {Function} setAvatarError - Function to set avatar error state
 * @param {Function} setAvatarPreview - Function to set avatar preview state
 * @returns {void}
 */
const handleAvatarChange = async (e, setAvatar, setAvatarError, setAvatarPreview) => {
  const file = e.target.files[0];
  setAvatar(null);
  setAvatarError("");
  setAvatarPreview(null);
  
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
  }
};

export default handleAvatarChange;
