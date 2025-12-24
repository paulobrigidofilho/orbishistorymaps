//////////////////////////////////////
// ===== HANDLE DELETE AVATAR ===== //
//////////////////////////////////////

// This function handles the avatar deletion process
// by making an API call to delete the avatar file

/**
 * Handles the deletion of stored avatar from database
 * Makes API call to remove avatar and updates UI states
 *
 * @param {string} userId - The user ID
 * @param {Function} setAvatar - Function to set avatar state
 * @param {Function} setAvatarPreview - Function to set avatar preview state
 * @param {Function} setAvatarError - Function to set avatar error state
 * @returns {Promise<void>}
 */

// ======= Module Imports ======= //

import axios from "axios";
import { DEFAULT_AVATAR } from "../constants/authConstants";
import { AVATAR_ERRORS } from "../constants/authErrorMessages";

const API_BASE = import.meta.env.VITE_API_URL;

// ======= handleDeleteAvatar Function ======= //

const handleDeleteAvatar = async (
  userId,
  setAvatar,
  setAvatarPreview,
  setAvatarError
) => {
  try {
    const response = await axios.delete(`${API_BASE}/api/avatar/${userId}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      setAvatar(null);
      setAvatarPreview(DEFAULT_AVATAR);
      setAvatarError("");
    }
  } catch (error) {
    setAvatarError(
      `${AVATAR_ERRORS.DELETE_FAILED}: ${error.response?.data?.message || error.message}`
    );
  }
};

export default handleDeleteAvatar;
