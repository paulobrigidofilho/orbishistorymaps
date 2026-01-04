///////////////////////////////////////////////////////////////////////
// =================== REVIEW STATS HELPER ========================== //
///////////////////////////////////////////////////////////////////////

// Helper function to calculate review statistics from an array of reviews
// Used by AdminDashboard to display review breakdown

/**
 * Calculate review statistics from an array of reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Object containing total, approved, and pending counts
 */
export const calculateReviewStats = (reviews) => {
  if (!Array.isArray(reviews)) {
    return {
      total: 0,
      approved: 0,
      pending: 0,
    };
  }

  const total = reviews.length;
  const approved = reviews.filter((review) => review.is_approved === true).length;
  const pending = reviews.filter((review) => review.is_approved === false).length;

  return {
    total,
    approved,
    pending,
  };
};

export default calculateReviewStats;
