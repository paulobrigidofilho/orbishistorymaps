///////////////////////////////////////////////////////////////////////
// ============= VALIDATE AVATAR FILE FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

// This function validates avatar file uploads
// ensuring correct file size and type requirements

///////////////////////////////////////////////////////////////////////
// ====================== VALIDATE AVATAR FILE ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Validates an avatar file for upload
 * @param {File} file - The file object to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
const validateAvatarFile = (file) => {
  // No file provided is valid - avatars are optional
  if (!file) {
    return { success: true, error: null };
  }

  // Check file size (5MB limit before compression)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      success: false, 
      error: "File is too large. Maximum size is 5MB." 
    };
  }

  // Check file type - must be an image
  if (!file.type.startsWith("image/")) {
    return { 
      success: false, 
      error: "Invalid file type. Only image files are allowed." 
    };
  }

  // Check for valid image extensions
  const validExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
  if (!validExtensions.test(file.name)) {
    return { 
      success: false, 
      error: "Invalid file extension. Allowed: .jpeg, .jpg, .png, .gif, .webp" 
    };
  }

  return { success: true, error: null };
};

export default validateAvatarFile;
