///////////////////////////////////////////////////////////////////////
// =================== GET PRODUCT REVIEWS =========================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all reviews for a specific product

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { REVIEW_ENDPOINTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// ================ GET PRODUCT REVIEWS FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetches all reviews for a specific product
 * @param {string} productId - The product's ID
 * @returns {Promise<Array>} Array of product reviews
 */
export default async function getProductReviews(productId) {
  try {
    const response = await axios.get(
      REVIEW_ENDPOINTS.GET_PRODUCT_REVIEWS(productId),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw new Error(
      error.response?.data?.message || REVIEW_ERROR_MESSAGES.FETCH_FAILED
    );
  }
}
