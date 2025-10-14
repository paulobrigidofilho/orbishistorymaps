//////////////////////////////////////
// ===== FETCH PROFILE DATA ===== //
//////////////////////////////////////

// This function fetches profile data for a given user ID
// and handles validation and data parsing

import axios from "axios";
import { z } from "zod";

/**
 * Zod schema for validating profile ID
 */
const profileIdSchema = z.string()
  .min(1, { message: "No profile ID provided." });

/**
 * Zod schema for validating profile response data
 */
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
    zipCode: z.string().optional()
  })
});

/**
 * Fetches profile data for a given user ID
 * 
 * @param {string} profileId - The ID of the profile to fetch
 * @param {Object} setters - Object containing state setter functions
 * @returns {Promise<void>}
 */
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
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/${profileId}`);

    if (response.status === 200 && response.data) {
      // Validate response data
      try {
        const validatedData = profileResponseSchema.parse(response.data);
        const userData = validatedData.user;
        
        // Check if all required fields are empty
        if (!userData.firstName && !userData.lastName && !userData.email && !userData.nickname) {
          setters.setError("Profile data appears to be empty. Please try refreshing or contact support.");
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
        
        // Update avatar URL construction using environment variable
        if (currentAvatarPath) {
          setters.setAvatarPreview(currentAvatarPath.startsWith('http')
                          ? currentAvatarPath
                          : `${process.env.REACT_APP_API_URL}${currentAvatarPath}`);
        } else {
          setters.setAvatarPreview(null);
        }
      } catch (validationError) {
        setters.setError("Invalid profile data format. Please contact support.");
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
