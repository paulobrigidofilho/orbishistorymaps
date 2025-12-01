//////////////////////////////////////
// ===== HANDLE AVATAR CHANGE ===== //
//////////////////////////////////////

// This function handles the avatar file change event
// Validates file size and type before setting the avatar (avatarValidator.js)

// ======= Module Imports ======= //
import { validateAvatar } from "../validators/avatarValidator"; // Add missing import

// ======= handleAvatarChange Function ======= //
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
