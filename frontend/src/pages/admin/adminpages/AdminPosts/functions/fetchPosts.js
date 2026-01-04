///////////////////////////////////////////////////////////////////////
// ================== FETCH POSTS FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

// This function fetches all posts for admin management

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== FETCH POSTS FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetch all posts with optional filters
 * @param {Object} options - Filter options
 * @param {number} options.page - Current page
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @param {string} options.search - Search query
 * @param {string} options.sortBy - Sort field
 * @param {string} options.sortOrder - Sort direction
 * @returns {Promise<Object>} Posts and pagination data
 */
export const fetchPosts = async (options = {}) => {
  const { page = 1, limit = 10, status, search, sortBy, sortOrder } = options;

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (status && status !== "all") params.append("status", status);
  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  const response = await axios.get(`${API_BASE_URL}${POST_API.GET_ALL}?${params.toString()}`);
  return response.data;
};

export default fetchPosts;
