///////////////////////////////////////////////////////////////////////
// ================== DELETE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

// This function deletes a post

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== DELETE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Delete a post
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Delete result
 */
export const deletePost = async (postId) => {
  const response = await axios.delete(`${API_BASE_URL}${POST_API.DELETE(postId)}`);
  return response.data;
};

export default deletePost;
