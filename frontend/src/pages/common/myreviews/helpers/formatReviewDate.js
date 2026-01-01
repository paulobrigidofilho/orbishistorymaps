///////////////////////////////////////////////////////////////////////
// =================== FORMAT REVIEW DATE ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains helper functions for formatting review dates

///////////////////////////////////////////////////////////////////////
// =================== FORMATTING FUNCTIONS ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Formats a date string for review display
 * @param {string|Date} dateStr - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Include time in output
 * @param {string} options.locale - Locale for formatting
 * @returns {string} Formatted date string
 */
export function formatReviewDate(dateStr, options = {}) {
  const { includeTime = false, locale = "en-US" } = options;

  if (!dateStr) return "Unknown date";

  try {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    if (includeTime) {
      dateOptions.hour = "2-digit";
      dateOptions.minute = "2-digit";
    }

    return date.toLocaleDateString(locale, dateOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown date";
  }
}

/**
 * Gets relative time string (e.g., "2 days ago")
 * @param {string|Date} dateStr - The date to format
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateStr) {
  if (!dateStr) return "Unknown";

  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "Unknown";
  }
}

// ===== Default export for convenience ===== //
export default {
  formatReviewDate,
  getRelativeTime,
};
