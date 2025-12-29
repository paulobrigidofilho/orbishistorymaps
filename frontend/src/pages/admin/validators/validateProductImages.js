///////////////////////////////////////////////////////////////////////
// ============= VALIDATE PRODUCT IMAGES FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function validates product image files for upload
// ensuring correct file size, type, and count requirements

///////////////////////////////////////////////////////////////////////
// ====================== CONSTANTS ================================== //
///////////////////////////////////////////////////////////////////////

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_IMAGE_LIMIT = 5;

///////////////////////////////////////////////////////////////////////
// ====================== VALIDATE SINGLE IMAGE ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates a single image file for upload
 * @param {File} file - The file object to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateSingleImage = (file) => {
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File "${file.name}" exceeds 10MB limit`,
    };
  }

  return { success: true, error: null };
};

///////////////////////////////////////////////////////////////////////
// ====================== VALIDATE MULTIPLE IMAGES =================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates multiple image files for product upload
 * @param {File[]} files - Array of file objects to validate
 * @param {number} currentImageCount - Number of existing images
 * @param {number} imageLimit - Maximum allowed images (default: 5)
 * @returns {Object} - { success: boolean, error: string | null, validFiles: Object[] }
 */
export const validateProductImages = (
  files,
  currentImageCount = 0,
  imageLimit = DEFAULT_IMAGE_LIMIT
) => {
  if (!files || files.length === 0) {
    return { success: true, error: null, validFiles: [] };
  }

  // Check total image limit
  const totalImages = currentImageCount + files.length;
  if (totalImages > imageLimit) {
    return {
      success: false,
      error: `Maximum ${imageLimit} images allowed. You have ${currentImageCount}, trying to add ${files.length}`,
      validFiles: [],
    };
  }

  // Validate each file
  const validFiles = [];
  for (const file of files) {
    const validation = validateSingleImage(file);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error,
        validFiles: [],
      };
    }

    validFiles.push({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(), // Unique ID for key
    });
  }

  return { success: true, error: null, validFiles };
};

export default validateProductImages;
