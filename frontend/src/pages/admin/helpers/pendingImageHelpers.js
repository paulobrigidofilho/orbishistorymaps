///////////////////////////////////////////////////////////////////////
// ============= PENDING IMAGE HELPERS ============================== //
///////////////////////////////////////////////////////////////////////

// Pure utility functions for managing pending images state
// Used by AddProductModal for image operations before product creation

///////////////////////////////////////////////////////////////////////
// ====================== REMOVE PENDING IMAGE ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Removes an image from the pending images array by ID
 * Also revokes the object URL to prevent memory leaks
 * @param {Array} currentImages - Current pending images array
 * @param {string|number} imageId - The image ID to remove
 * @returns {Array} - New array without the removed image
 */
export const removePendingImage = (currentImages, imageId) => {
  const imageToRemove = currentImages.find((img) => img.id === imageId);
  if (imageToRemove && imageToRemove.preview) {
    URL.revokeObjectURL(imageToRemove.preview); // Clean up preview URL
  }
  return currentImages.filter((img) => img.id !== imageId);
};

///////////////////////////////////////////////////////////////////////
// ====================== CLEANUP PENDING IMAGES ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Revokes all object URLs from pending images array
 * Used when closing modal or resetting form
 * @param {Array} pendingImages - Array of pending images to cleanup
 */
export const cleanupPendingImages = (pendingImages) => {
  pendingImages.forEach((img) => {
    if (img.preview) {
      URL.revokeObjectURL(img.preview);
    }
  });
};

export default { removePendingImage, cleanupPendingImages };
