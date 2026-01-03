///////////////////////////////////////
// ===== HANDLE PROFILE SUBMIT ===== //
///////////////////////////////////////

/**
 * Handles the form submission for profile updates
 *
 * @param {Object} e - The event object from form submission
 * @param {Object} profileData - Object containing profile form state values
 * @param {Object} setters - Object containing state setter functions
 * @param {string} profileId - The ID of the profile being updated
 * @param {Object} user - Current logged-in user from context
 * @returns {Promise<void>}
 */

// ====== Module Imports ===== //

import axios from "axios";
import { API_BASE } from "../constants/authConstants";
import { PROFILE_ERRORS } from "../constants/authErrorMessages";
import {
  validateProfileUpdate,
  validateProfileAccess,
} from "../validators/profileValidator";

// ======= handleProfileSubmit Function ======= //

const handleProfileSubmit = async (
  e,
  profileData,
  setters,
  profileId,
  user
) => {
  e.preventDefault();
  setters.setError("");
  setters.setSuccessMessage("");

  // ========================= ACCESS VALIDATION ========================= //
  // Check if the logged-in user is allowed to edit this profile
  const accessValidation = validateProfileAccess(
    profileData.currentUserId,
    user
  );
  if (!accessValidation.success) {
    setters.setError(accessValidation.error);
    return;
  }

  // ========================= FORM VALIDATION ========================= //
  // Validate profile update data
  const profileValidation = validateProfileUpdate({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    nickname: profileData.nickname,
    address: profileData.address,
    addressLine2: profileData.addressLine2,
    city: profileData.city,
    stateName: profileData.stateName,
    zipCode: profileData.zipCode,
    country: profileData.country,
  });

  if (!profileValidation.success) {
    setters.setError(profileValidation.error);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    formData.append("email", profileData.email);
    formData.append("nickname", profileData.nickname);
    formData.append("address", profileData.address);
    formData.append("addressLine2", profileData.addressLine2);
    formData.append("city", profileData.city);
    formData.append("state", profileData.stateName);
    formData.append("zipCode", profileData.zipCode);
    formData.append("country", profileData.country || "New Zealand");

    // Handle avatar: Append only if it's a new File object
    if (profileData.avatar instanceof File) {
      formData.append("avatar", profileData.avatar);
    } else if (typeof profileData.avatar === "string" && profileData.avatar) {
      // If it's the existing URL string, send it so backend knows not to change it unless a file is sent
      formData.append("avatarUrl", profileData.avatar);
    }

    // Make the API request to update the profile
    const response = await axios.put(
      `${API_BASE}/api/profile/${profileId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    // Handle success response
    if (response.status === 200) {
      setters.setSuccessMessage("Profile updated successfully!");

      const updatedUserData =
        response.data.result?.user || response.data.user || {};

      // Simplified avatar URL handling - no baseUrl needed
      const finalAvatarPath =
        updatedUserData.avatar ||
        (profileData.avatar instanceof File
          ? URL.createObjectURL(profileData.avatar)
          : profileData.avatar);
      const finalAvatarUrl =
        finalAvatarPath && finalAvatarPath.startsWith("http")
          ? finalAvatarPath
          : finalAvatarPath; // Keep as relative path

      // Update the AuthContext if the updated profile belongs to the logged-in user
      if (user && setters.setUser && user.id === profileData.currentUserId) {
        setters.setUser({
          ...user,
          firstName: updatedUserData.firstName || profileData.firstName,
          lastName: updatedUserData.lastName || profileData.lastName,
          email: updatedUserData.email || profileData.email,
          nickname: updatedUserData.nickname || profileData.nickname,
          avatar: finalAvatarUrl,
          address: updatedUserData.address || profileData.address,
          addressLine2:
            updatedUserData.addressLine2 || profileData.addressLine2,
          city: updatedUserData.city || profileData.city,
          state: updatedUserData.state || profileData.stateName,
          zipCode: updatedUserData.zipCode || profileData.zipCode,
          country: updatedUserData.country || profileData.country,
        });
      }

      // Update avatar preview to reflect the saved state
      if (finalAvatarPath) {
        setters.setAvatarPreview(finalAvatarUrl);
        // If a new file was uploaded, update the 'avatar' state
        if (profileData.avatar instanceof File) {
          setters.setAvatar(updatedUserData.avatar); // Store the path returned by server
        }
      } else {
        setters.setAvatarPreview(null); // If avatar was removed
      }
    } else {
      // Handle non-200 success or unexpected response format
      setters.setError(
        response.data?.message || "Profile update failed. Unexpected response."
      );
    }
  } catch (error) {
    // Handle network errors or errors thrown by the backend
    const errorMessage =
      error.response?.data?.message || error.message || PROFILE_ERRORS.UPDATE_FAILED;
    setters.setError(
      "Profile update failed: " + errorMessage
    );
    console.error("Profile update error:", error.message);
  }
};

export default handleProfileSubmit;
