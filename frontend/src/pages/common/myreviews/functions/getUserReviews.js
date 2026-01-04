///////////////////////////////////////////////////////////////////////
// =================== GET USER REVIEWS ============================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all reviews submitted by the current user

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { REVIEW_ENDPOINTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// ================== GET USER REVIEWS FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches all reviews submitted by a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of user's reviews
 */
export default async function getUserReviews(userId) {
  try {
    const response = await axios.get(REVIEW_ENDPOINTS.GET_USER_REVIEWS(userId), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw new Error(
      error.response?.data?.message || REVIEW_ERROR_MESSAGES.FETCH_FAILED
    );
  }
}
