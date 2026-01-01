///////////////////////////////////////////////////////////////////////
// ====================== UPDATE REVIEW ============================== //
///////////////////////////////////////////////////////////////////////

// This function updates an existing review

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { REVIEW_ENDPOINTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// =================== UPDATE REVIEW FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Updates an existing review
 * @param {string} reviewId - The review's ID to update
 * @param {number} rating - The new rating (1-5)
 * @param {string} reviewText - The new review text/comment
 * @param {string} reviewTitle - The new review title (optional)
 * @returns {Promise<Object>} Updated review data
 */
export default async function updateReview(reviewId, rating, reviewText, reviewTitle = null) {
  try {
    const payload = {
      rating,
      review_text: reviewText,
    };
    
    if (reviewTitle) {
      payload.review_title = reviewTitle;
    }

    const response = await axios.put(
      REVIEW_ENDPOINTS.UPDATE_REVIEW(reviewId),
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error(
      error.response?.data?.message || REVIEW_ERROR_MESSAGES.UPDATE_FAILED
    );
  }
}
