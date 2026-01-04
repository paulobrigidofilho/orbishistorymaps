///////////////////////////////////////////////////////////////////////
// ================== CREATE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

// This function creates a new post

//  ========== Module imports  ========== //
import axios from "axios";

//  ========== Constants imports  ========== //
import { POST_API } from "../constants/postConstants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Configure axios defaults
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////
// ================== CREATE POST FUNCTION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
export const createPost = async (postData) => {
  const response = await axios.post(`${API_BASE_URL}${POST_API.CREATE}`, postData);
  return response.data;
};

export default createPost;
