///////////////////////////////////////////////////////////////////////
// ================== TRUNCATE TEXT HELPER ========================== //
///////////////////////////////////////////////////////////////////////

// This helper truncates text to a specified length with ellipsis

///////////////////////////////////////////////////////////////////////
// ================== TRUNCATE TEXT FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  
  if (text.length <= maxLength) return text;

  // Find the last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.7) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
};

export default truncateText;
