///////////////////////////////////////////////////////////////////////
// ============= VALIDATE SINGLE PRODUCT IMAGE ====================== //
///////////////////////////////////////////////////////////////////////

// Validates a single image file for product upload (for edit modal)
// Returns validation result with success status and error message

///////////////////////////////////////////////////////////////////////
// ====================== CONSTANTS ================================== //
///////////////////////////////////////////////////////////////////////

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

///////////////////////////////////////////////////////////////////////
// ====================== VALIDATE FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates a single image file for product upload
 * @param {File} file - The file object to validate
 * @param {number} currentImageCount - Number of existing images
 * @param {number} imageLimit - Maximum allowed images
 * @returns {Object} - { success: boolean, error: string | null }
 */
const validateEditProductImage = (file, currentImageCount, imageLimit) => {
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Check image limit first
  if (currentImageCount >= imageLimit) {
    return {
      success: false,
      error: `Maximum ${imageLimit} images allowed per product`,
    };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "Image must be less than 10MB",
    };
  }

  return { success: true, error: null };
};

export default validateEditProductImage;
