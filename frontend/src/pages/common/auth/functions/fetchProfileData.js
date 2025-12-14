////////////////////////////////////
// ===== FETCH PROFILE DATA ===== //
////////////////////////////////////

// This function fetches profile data from the backend API

/**
 * Fetches user profile data from the backend
 *
 * @param {string} profileId - The user profile ID
 * @param {Object} setters - Object containing state setter functions
 * @returns {Promise<void>}
 */

// ======= Module Imports ======= //
import axios from "axios";
import { API_BASE, DEFAULT_AVATAR } from "../constants/authConstants";
import { PROFILE_ERRORS } from "../constants/authErrorMessages";

// ======= fetchProfileData Function ======= //
const fetchProfileData = async (profileId, setters) => {
  try {
    const response = await axios.get(`${API_BASE}/api/profile/${profileId}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const data = response.data;
      // Support multiple response shapes: { user: {...} } or flat object
      const payload = data?.user ?? data?.profile ?? data ?? {};

      const avatarRaw = payload.avatar;
      const avatarPath =
        typeof avatarRaw === "string" && avatarRaw.trim() !== ""
          ? avatarRaw.startsWith("http")
            ? avatarRaw
            : `${API_BASE.replace(/\/+$/, "")}${avatarRaw}`
          : null;

      // Set all state values
      setters.setFirstName(payload.firstName || "");
      setters.setLastName(payload.lastName || "");
      setters.setEmail(payload.email || "");
      setters.setNickname(payload.nickname || "");
      setters.setAddress(payload.address || "");
      setters.setAddressLine2(payload.addressLine2 || "");
      setters.setCity(payload.city || "");
      setters.setStateName(payload.state || ""); // backend uses `state`
      setters.setZipCode(payload.zipCode || "");
      setters.setCurrentUserId(payload.id || payload._id || profileId || "");
      setters.setError("");

      // Avatar states
      setters.setAvatar(null);
      setters.setAvatarPreview(avatarPath || DEFAULT_AVATAR);

      if (setters.setStoredAvatarPath) {
        setters.setStoredAvatarPath(avatarPath || null);
      }
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      PROFILE_ERRORS.FETCH_FAILED;
    setters.setError(errorMessage);
    console.error("Error fetching profile:", error);
  }
};

export default fetchProfileData;
