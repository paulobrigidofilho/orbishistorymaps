///////////////////////////////////////////////////////////////////////
// ================ FORMAT DATE DMY FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

// This function formats a date string to DD/MM/YYYY format

///////////////////////////////////////////////////////////////////////
// ======================= FORMAT DATE DMY =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Formats a date to DD/MM/YYYY format
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string or 'N/A' if invalid
 */
const formatDateDMY = (dateValue) => {
  if (!dateValue) return "N/A";
  
  const date = new Date(dateValue);
  
  if (isNaN(date.getTime())) return "N/A";
  
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

export default formatDateDMY;
