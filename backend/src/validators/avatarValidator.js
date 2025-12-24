//////////////////////////////////
// ===== AVATAR VALIDATOR ===== //
//////////////////////////////////

// This validator handles validation for avatar uploads
// ensuring correct file size and type requirements

const { VALIDATION_ERRORS } = require("../constants/errorMessages");

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates an avatar file
 * @param {Object} file - The file object from multer
 * @returns {Object} - { success: boolean, error: string | null }
 */
const validateAvatar = (file) => {
  // Skip validation if no file is provided (avatar is optional)
  if (!file) {
    return { success: true, error: null };
  }
  
  // Check file size (max 5MB to match frontend and multer config)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { success: false, error: VALIDATION_ERRORS.FILE_TOO_LARGE };
  }
  
  // Check file type - must be an image
  if (!file.mimetype.startsWith("image/")) {
    return { success: false, error: VALIDATION_ERRORS.INVALID_FILE_TYPE };
  }
  
  return { success: true, error: null };
};

module.exports = {
  validateAvatar
};
