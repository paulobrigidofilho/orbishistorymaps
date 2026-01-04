///////////////////////////////////////////////////////////////////////
// ================== FORMAT POST DATE HELPER ======================= //
///////////////////////////////////////////////////////////////////////

// This helper formats a date string for display in the post feed

///////////////////////////////////////////////////////////////////////
// ================== FORMAT POST DATE FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Format a date string for display in the post feed
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatPostDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "";

  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-NZ", options);
};

export default formatPostDate;
