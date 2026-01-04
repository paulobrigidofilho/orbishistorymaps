///////////////////////////////////////////////////////////////////////
// =================== REVIEW VALIDATOR ============================== //
///////////////////////////////////////////////////////////////////////

// This file contains validation functions for review data

//  ========== Constants imports  ========== //
import { REVIEW_DEFAULTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// =================== VALIDATION FUNCTIONS ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates a rating value
 * @param {number} rating - The rating to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateRating(rating) {
  const ratingNum = Number(rating);
  
  if (isNaN(ratingNum) || ratingNum < REVIEW_DEFAULTS.MIN_RATING || ratingNum > REVIEW_DEFAULTS.MAX_RATING) {
    return {
      isValid: false,
      error: REVIEW_ERROR_MESSAGES.INVALID_RATING,
    };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates review text/comment
 * @param {string} text - The review text to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateReviewText(text) {
  if (!text || typeof text !== "string") {
    return {
      isValid: false,
      error: REVIEW_ERROR_MESSAGES.COMMENT_TOO_SHORT,
    };
  }

  const trimmedText = text.trim();

  if (trimmedText.length < REVIEW_DEFAULTS.MIN_COMMENT_LENGTH) {
    return {
      isValid: false,
      error: REVIEW_ERROR_MESSAGES.COMMENT_TOO_SHORT,
    };
  }

  if (trimmedText.length > REVIEW_DEFAULTS.MAX_COMMENT_LENGTH) {
    return {
      isValid: false,
      error: REVIEW_ERROR_MESSAGES.COMMENT_TOO_LONG,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates complete review data
 * @param {Object} reviewData - The review data to validate
 * @param {number} reviewData.rating - The rating (1-5)
 * @param {string} reviewData.reviewText - The review text/comment
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateReviewData(reviewData) {
  const errors = {};

  const ratingValidation = validateRating(reviewData.rating);
  if (!ratingValidation.isValid) {
    errors.rating = ratingValidation.error;
  }

  const textValidation = validateReviewText(reviewData.reviewText);
  if (!textValidation.isValid) {
    errors.reviewText = textValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Legacy validation function (for backward compatibility)
 * @param {number} rating - The rating (1-5)
 * @param {string} comment - The review comment
 * @returns {string|null} Error message or null if valid
 */
export function validateReview(rating, comment) {
  const ratingValidation = validateRating(rating);
  if (!ratingValidation.isValid) {
    return ratingValidation.error;
  }

  const textValidation = validateReviewText(comment);
  if (!textValidation.isValid) {
    return textValidation.error;
  }

  return null;
}

// ===== Default export for convenience ===== //
export default {
  validateRating,
  validateReviewText,
  validateReviewData,
  validateReview,
};
