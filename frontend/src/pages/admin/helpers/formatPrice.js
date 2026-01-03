///////////////////////////////////////////////////////////////////////
// =================== PRICE FORMATTING HELPER ====================== //
///////////////////////////////////////////////////////////////////////

// Helper function for formatting prices with NZD currency

/**
 * Formats a price value to NZD currency string
 * @param {number|string} value - The price value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showCurrency - Whether to show "NZD" prefix (default: true)
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price string
 */
export const formatPrice = (value, options = {}) => {
  const { showCurrency = true, decimals = 2 } = options;
  const numValue = parseFloat(value) || 0;
  const formatted = numValue.toFixed(decimals);
  
  return showCurrency ? `NZD $${formatted}` : `$${formatted}`;
};

/**
 * Formats a price value to NZD currency string (short version without "NZD")
 * @param {number|string} value - The price value to format
 * @returns {string} Formatted price string with $ only
 */
export const formatPriceShort = (value) => {
  return formatPrice(value, { showCurrency: false });
};

export default formatPrice;
