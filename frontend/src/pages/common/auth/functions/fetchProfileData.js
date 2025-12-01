////////////////////////////////////
// ===== FETCH PROFILE DATA ===== //
////////////////////////////////////

// This function fetches profile data for a given user ID
// and handles validation and data parsing

// ===== Module Imports ===== //

import axios from "axios";
import { z } from "zod";

// ======= Zod Schemas ======= //

// Schema for validating profileId
const profileIdSchema = z
  .string()
  .min(1, { message: "No profile ID provided." });

// Schema for validating profile response data
const profileResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    nickname: z.string().optional(),
    avatar: z.string().nullable().optional(),
    address: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
});

// ======= fetchProfileData Function ======= //

const API_BASE = import.meta.env.VITE_API_URL;

const fetchProfileData = async (profileId, setters) => {
  setters.setError(""); // Clear previous errors

  // Validate profileId
  try {
    profileIdSchema.parse(profileId);
  } catch (error) {
    setters.setError("Invalid or missing profile ID");
    return;
  }

  try {
    // Fetch profile data from API
    const response = await axios.get(
      `${API_BASE}/api/profile/${profileId}`,
      { withCredentials: true }
    );

    if (response.status === 200 && response.data) {
      // Validate response data
      try {
        const validatedData = profileResponseSchema.parse(response.data);
        const userData = validatedData.user;

        // Check if all required fields are empty
        if (
          !userData.firstName &&
          !userData.lastName &&
          !userData.email &&
          !userData.nickname
        ) {
          setters.setError(
            "Profile data appears to be empty. Please try refreshing or contact support."
          );
          return;
        }

        // Populate form with data, with fallbacks to prevent empty fields
        setters.setFirstName(userData.firstName || "");
        setters.setLastName(userData.lastName || "");
        setters.setEmail(userData.email || "");
        setters.setNickname(userData.nickname || "");
        setters.setAddress(userData.address || "");
        setters.setAddressLine2(userData.addressLine2 || "");
        setters.setCity(userData.city || "");
        setters.setStateName(userData.state || "");
        setters.setZipCode(userData.zipCode || "");
        setters.setCurrentUserId(userData.id || "");

        // Handle avatar display logic
        const currentAvatarPath = userData.avatar || null;
        setters.setAvatar(currentAvatarPath);

        // Update avatar URL construction using resolved baseUrl or keep relative
        if (currentAvatarPath) {
          const preview = currentAvatarPath.startsWith("http")
            ? currentAvatarPath
            : currentAvatarPath; // Keep as relative path
          setters.setAvatarPreview(preview);
        } else {
          setters.setAvatarPreview(null);
        }
      } catch (validationError) {
        setters.setError(
          "Invalid profile data format. Please contact support."
        );
        console.error("Profile data validation error:", validationError);
      }
    } else {
      setters.setError(response.data?.message || "Failed to load profile data");
      console.error("Fetch profile failed:", response);
    }
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    if (err.response && err.response.status === 404) {
      setters.setError("Profile not found.");
    } else {
      setters.setError(`Failed to fetch profile data: ${err.message}`);
    }
  }
};

export default fetchProfileData;
