///////////////////////////////////////////////////////////////////////
// ================== INCREMENT VIEW COUNT FUNCTION ================= //
///////////////////////////////////////////////////////////////////////

// This function increments the view count for a post

//  ========== Constants imports  ========== //
import { POST_FEED_API } from "../constants/postFeedConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

///////////////////////////////////////////////////////////////////////
// ================== INCREMENT VIEW COUNT FUNCTION ================= //
///////////////////////////////////////////////////////////////////////

/**
 * Increment view count for a specific post
 * @param {number} postId - The ID of the post
 * @returns {Promise<Object>} Updated view count
 */
export const incrementViewCount = async (postId) => {
  const response = await fetch(`${API_BASE_URL}${POST_FEED_API.INCREMENT_VIEW(postId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to increment view count");
  }

  return response.json();
};

export default incrementViewCount;
