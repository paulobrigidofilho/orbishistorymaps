///////////////////////////////////////////////////////////////////////
// ================== FETCH PUBLISHED POSTS FUNCTION ================ //
///////////////////////////////////////////////////////////////////////

// This function fetches published posts for the public feed

//  ========== Constants imports  ========== //
import { POST_FEED_API } from "../constants/postFeedConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

///////////////////////////////////////////////////////////////////////
// ================== FETCH PUBLISHED POSTS FUNCTION ================ //
///////////////////////////////////////////////////////////////////////

/**
 * Fetch published posts for the public feed
 * @param {Object} options - Fetch options
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Number of posts per page
 * @returns {Promise<Object>} Posts and pagination data
 */
export const fetchPublishedPosts = async ({ page = 1, limit = 3 } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}${POST_FEED_API.GET_POSTS}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export default fetchPublishedPosts;
