////////////////////////////////////////////////
// ===== HANDLE PROFILE AVATAR CHANGE ======= //
////////////////////////////////////////////////

// This function handles the avatar file change event for profile updates
// Validates file size and type before setting the avatar

/**
 * @param {Object} e - The event object from file input change
 * @param {Function} setAvatar - Function to set avatar state
 * @param {Function} setAvatarError - Function to set avatar error state
 * @param {Function} setAvatarPreview - Function to set avatar preview state
 * @returns {void}
 */

const handleProfileAvatarChange = (e, setAvatar, setAvatarError, setAvatarPreview) => {
  const file = e.target.files[0];
  setAvatarError(""); // Clear previous avatar errors

  if (file) {
    // Validation logic (Size, Type)
    if (file.size > 1024 * 1024) { // 1MB Limit
      setAvatarError("Avatar must be less than 1MB.");
      setAvatar(null);
      setAvatarPreview(null); // Clear preview on error
      e.target.value = "";
      return;
    }
    
    const allowedTypes = /jpeg|jpg|png|gif/;
    // Ensure consistent check for extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.test(fileExtension) || !allowedTypes.test(file.type)) {
      setAvatarError("Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!");
      setAvatar(null);
      setAvatarPreview(null); // Clear preview on error
      e.target.value = "";
      return;
    }
    
    // If validation passes:
    setAvatar(file); // Store the File object for upload
    setAvatarPreview(URL.createObjectURL(file)); // Set preview URL
  }
};

export default handleProfileAvatarChange;
