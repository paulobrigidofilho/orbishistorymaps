///////////////////////////////////////////////////////////////////////
// ============= GENERATE SKU FUNCTION ============================== //
///////////////////////////////////////////////////////////////////////

// This function generates a unique SKU from product name
// Used when creating new products without a custom SKU

///////////////////////////////////////////////////////////////////////
// ====================== GENERATE SKU =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Generates a SKU from product name and timestamp
 * @param {string} productName - The product name to generate SKU from
 * @returns {string} - Generated SKU (e.g., "PRONAM-123456")
 */
const generateSKU = (productName) => {
  if (!productName) return "";

  // Clean product name: take first 3-5 chars of first 2 words
  const words = productName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);

  let prefix = "";
  if (words.length >= 2) {
    prefix = words[0].substring(0, 3) + words[1].substring(0, 3);
  } else if (words.length === 1) {
    prefix = words[0].substring(0, 6);
  }

  // Add timestamp-based suffix for uniqueness (last 6 digits of timestamp)
  const suffix = Date.now().toString().slice(-6);

  return `${prefix}-${suffix}`;
};

export default generateSKU;
