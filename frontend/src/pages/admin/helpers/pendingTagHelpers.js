///////////////////////////////////////////////////////////////////////
// ============= PENDING TAG HELPERS ================================ //
///////////////////////////////////////////////////////////////////////

// Pure utility functions for managing pending tags state
// Used by AddProductModal for tag operations before product creation

///////////////////////////////////////////////////////////////////////
// ====================== CREATE PENDING TAG ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Creates a new pending tag object with temporary ID
 * @param {string} tagName - The tag name to create
 * @returns {Object} - Tag object with temp id and name
 */
export const createPendingTag = (tagName) => {
  const tempId = `temp-${Date.now()}-${Math.random()}`;
  return { tag_id: tempId, tag_name: tagName };
};

///////////////////////////////////////////////////////////////////////
// ====================== ADD PENDING TAG ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Adds a new tag to the pending tags array
 * @param {Array} currentTags - Current pending tags array
 * @param {string} tagName - The tag name to add
 * @returns {Array} - New array with the added tag
 */
export const addPendingTag = (currentTags, tagName) => {
  const newTag = createPendingTag(tagName);
  return [...currentTags, newTag];
};

///////////////////////////////////////////////////////////////////////
// ====================== REMOVE PENDING TAG ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Removes a tag from the pending tags array by ID
 * @param {Array} currentTags - Current pending tags array
 * @param {string|number} tagId - The tag ID to remove
 * @returns {Array} - New array without the removed tag
 */
export const removePendingTag = (currentTags, tagId) => {
  return currentTags.filter((tag) => tag.tag_id !== tagId);
};

export default { createPendingTag, addPendingTag, removePendingTag };
