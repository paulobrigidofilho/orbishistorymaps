///////////////////////////////////////////////////////////////////////
// =================== REVIEW CONSTANTS (SHOP) ====================== //
///////////////////////////////////////////////////////////////////////

// Constants for review-related UI messages in the shop module

// ===== Success Messages ===== //
export const REVIEW_SUCCESS_MESSAGES = {
  SUBMITTED: "Review Submitted",
  UPDATED: "Review Updated",
  DELETED: "Review Deleted",
};

// ===== Error Messages ===== //
export const REVIEW_ERROR_MESSAGES = {
  RATING_REQUIRED: "Please select a rating",
  COMMENT_REQUIRED: "Please write a comment",
  COMMENT_TOO_SHORT: "Comment must be at least 10 characters",
  COMMENT_TOO_LONG: "Comment must be less than 1000 characters",
  SUBMIT_FAILED: "Failed to submit review",
  UPDATE_FAILED: "Failed to update review",
  ALREADY_REVIEWED: "You have already reviewed this product",
};

// ===== Info Messages ===== //
export const REVIEW_INFO_MESSAGES = {
  ONE_REVIEW_ONLY: "You have already reviewed this product. Only one review per product is allowed.",
  LOGIN_REQUIRED: "Please log in to write a review",
};
