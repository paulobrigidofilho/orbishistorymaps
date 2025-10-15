//////////////////////////////////
// ===== AVATAR VALIDATOR ===== //
//////////////////////////////////

// This validator handles validation for avatar uploads
// ensuring correct file size and type requirements

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates an avatar file
 * @param {Object} file - The file object from multer
 * @returns {Object} - { success: boolean, error: string | null }
 */
const validateAvatar = (file) => {
  // Skip validation if no file is provided
  if (!file) {
    return { success: true, error: null };
  }
  
  // Check file size (max 1MB)
  const maxSize = 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    return { success: false, error: "File must be less than 1MB" };
  }
  
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = file.mimetype.split('/')[1];
  
  if (!allowedTypes.test(mimeType)) {
    return { success: false, error: "Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!" };
  }
  
  return { success: true, error: null };
};

///////////////////////////////////////////////////////////////////////
// ========================= EXPORT VALIDATORS ===================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  validateAvatar
};
// ========================= EXPORT VALIDATORS ===================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  validateAvatar
};
