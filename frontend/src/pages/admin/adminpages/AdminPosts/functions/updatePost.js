///////////////////////////////////////////////////////////////////////
// ================== UPDATE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

// This function updates an existing post

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== UPDATE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Update an existing post
 * @param {string} postId - Post ID
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} Updated post
 */
export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${API_BASE_URL}${POST_API.UPDATE(postId)}`, postData);
  return response.data;
};

export default updatePost;
