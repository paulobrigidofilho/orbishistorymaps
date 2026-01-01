///////////////////////////////////////////////////////////////////////
// =================== FORMAT ORDER DATE ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains helper functions for formatting order dates

///////////////////////////////////////////////////////////////////////
// =================== FORMATTING FUNCTIONS ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Formats a date string for order display
 * @param {string|Date} dateStr - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Include time in output
 * @param {string} options.locale - Locale for formatting
 * @returns {string} Formatted date string
 */
export function formatOrderDate(dateStr, options = {}) {
  const { includeTime = true, locale = "en-US" } = options;

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
 * Formats currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  if (amount === null || amount === undefined) return "$0.00";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Gets order status badge style
 * @param {string} status - Order status
 * @param {Object} statusConfig - Status configuration from ORDER_STATUS
 * @returns {Object} Style object for status badge
 */
export function getStatusBadgeStyle(status, statusConfig) {
  const config = statusConfig?.[status] || { color: "#666" };
  
  return {
    backgroundColor: config.color,
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: 500,
  };
}

// ===== Default export for convenience ===== //
export default {
  formatOrderDate,
  formatCurrency,
  getStatusBadgeStyle,
};
