///////////////////////////////////////////////////////////////////////
// ====================== CREATE REVIEW ============================== //
///////////////////////////////////////////////////////////////////////

// This function creates a new review for a product

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { REVIEW_ENDPOINTS, REVIEW_ERROR_MESSAGES } from "../constants/reviewConstants";

///////////////////////////////////////////////////////////////////////
// =================== CREATE REVIEW FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Creates a new review for a product
 * @param {string} productId - The product's ID to review
 * @param {number} rating - The rating (1-5)
 * @param {string} reviewText - The review text/comment
 * @param {string} reviewTitle - The review title (optional)
 * @param {string} orderId - The order ID for verified purchase (optional)
 * @returns {Promise<Object>} Created review data
 */
export default async function createReview(
  productId,
  rating,
  reviewText,
  reviewTitle = "Review",
  orderId = null
) {
  try {
    const payload = {
      product_id: productId,
      rating,
      review_title: reviewTitle,
      review_text: reviewText,
    };

    if (orderId) {
      payload.order_id = orderId;
    }

    const response = await axios.post(
      REVIEW_ENDPOINTS.CREATE_REVIEW,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error(
      error.response?.data?.message || REVIEW_ERROR_MESSAGES.CREATE_FAILED
    );
  }
}
