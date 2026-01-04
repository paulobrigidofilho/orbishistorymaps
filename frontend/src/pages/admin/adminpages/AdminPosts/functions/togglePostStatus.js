///////////////////////////////////////////////////////////////////////
// ================== TOGGLE POST STATUS FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function toggles a post's status between draft and published

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== TOGGLE POST STATUS FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

/**
 * Toggle post status between draft and published
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Updated post
 */
export const togglePostStatus = async (postId) => {
  const response = await axios.patch(`${API_BASE_URL}${POST_API.TOGGLE_STATUS(postId)}`);
  return response.data;
};

export default togglePostStatus;
