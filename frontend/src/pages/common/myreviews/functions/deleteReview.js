///////////////////////////////////////////////////////////////////////
// ====================== DELETE REVIEW ============================== //
///////////////////////////////////////////////////////////////////////

// This function deletes a user's review

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { REVIEW_ENDPOINTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// =================== DELETE REVIEW FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Deletes a review by ID
 * @param {string} reviewId - The review's ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export default async function deleteReview(reviewId) {
  try {
    const response = await axios.delete(REVIEW_ENDPOINTS.DELETE_REVIEW(reviewId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw new Error(
      error.response?.data?.message || REVIEW_ERROR_MESSAGES.DELETE_FAILED
    );
  }
}
