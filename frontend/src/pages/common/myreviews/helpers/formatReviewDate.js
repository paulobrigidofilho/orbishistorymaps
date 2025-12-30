///////////////////////////////////////////////////////////////////////
// =================== FORMAT REVIEW DATE =========================== //
///////////////////////////////////////////////////////////////////////

// Formats a date string for review display

export function formatReviewDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}
