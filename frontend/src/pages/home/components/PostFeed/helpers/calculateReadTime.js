///////////////////////////////////////////////////////////////////////
// ================== CALCULATE READ TIME HELPER ==================== //
///////////////////////////////////////////////////////////////////////

// This helper estimates reading time based on content length

///////////////////////////////////////////////////////////////////////
// ================== CALCULATE READ TIME FUNCTION ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Calculate estimated reading time in minutes
 * @param {string} content - The post content
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated reading time in minutes
 */
export const calculateReadTime = (content, wordsPerMinute = 200) => {
  if (!content) return 1;

  // Remove markdown syntax for more accurate word count
  const plainText = content
    .replace(/[#*_`\[\]()]/g, "") // Remove markdown characters
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes); // Minimum 1 minute
};

export default calculateReadTime;
