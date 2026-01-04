///////////////////////////////////////////////////////////////////////
// =================== MY REVIEWS CONSTANTS ========================= //
///////////////////////////////////////////////////////////////////////

// This file contains constant values used throughout the my reviews module

// ===== API Endpoints ===== //
// Use relative paths to work with Vite proxy
export const REVIEW_ENDPOINTS = {
  GET_USER_REVIEWS: (userId) => `/api/reviews/user/${userId}`,
  GET_PRODUCT_REVIEWS: (productId) => `/api/reviews/product/${productId}`,
  CREATE_REVIEW: `/api/reviews`,
  UPDATE_REVIEW: (reviewId) => `/api/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId) => `/api/reviews/${reviewId}`,
};

// ===== Rating Values ===== //
export const RATING_OPTIONS = [
  { value: 5, label: "★★★★★", description: "Excellent" },
  { value: 4, label: "★★★★☆", description: "Good" },
  { value: 3, label: "★★★☆☆", description: "Average" },
  { value: 2, label: "★★☆☆☆", description: "Poor" },
  { value: 1, label: "★☆☆☆☆", description: "Terrible" },
];

// ===== Default Values ===== //
export const REVIEW_DEFAULTS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT_LENGTH: 10,
  MAX_COMMENT_LENGTH: 1000,
};

// ===== Success Messages ===== //
export const REVIEW_SUCCESS_MESSAGES = {
  REVIEWS_LOADED: "Reviews loaded successfully",
  REVIEW_CREATED: "Review submitted successfully",
  REVIEW_UPDATED: "Review updated successfully",
  REVIEW_DELETED: "Review deleted successfully",
};

// ===== Error Messages ===== //
export const REVIEW_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load reviews",
  CREATE_FAILED: "Failed to submit review",
  UPDATE_FAILED: "Failed to update review",
  DELETE_FAILED: "Failed to delete review",
  INVALID_RATING: "Please select a valid rating (1-5)",
  COMMENT_TOO_SHORT: `Comment must be at least ${10} characters`,
  COMMENT_TOO_LONG: `Comment must be less than ${1000} characters`,
  NOT_AUTHENTICATED: "You must be logged in to submit a review",
};

// ===== Legacy Export (for backward compatibility) ===== //
export const REVIEW_MESSAGES = {
  NO_REVIEWS: "No reviews yet.",
  NO_USER_REVIEWS: "You have not submitted any reviews yet.",
  SUBMIT_SUCCESS: REVIEW_SUCCESS_MESSAGES.REVIEW_CREATED,
  UPDATE_SUCCESS: REVIEW_SUCCESS_MESSAGES.REVIEW_UPDATED,
  DELETE_SUCCESS: REVIEW_SUCCESS_MESSAGES.REVIEW_DELETED,
  ERROR: "An error occurred. Please try again.",
  FETCH_FAILED: REVIEW_ERROR_MESSAGES.FETCH_FAILED,
};
