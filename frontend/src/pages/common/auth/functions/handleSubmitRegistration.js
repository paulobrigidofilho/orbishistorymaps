////////////////////////////////////////////////
// ===== HANDLE REGISTRATION SUBMISSION ===== //
////////////////////////////////////////////////

// This function handles the form submission for user registration
// validating data and making the API call

/**
 * Handles the form submission for user registration
 * Prepares form data and makes API call to register the user
 *
 * @param {Object} e - The event object from form submission
 * @param {Object} formData - Object containing all form state values
 * @param {Object} setters - Object containing state setter functions
 * @returns {Promise<void>}
 */

// ====== Module Imports ===== //
import axios from "axios";
import {
  validatePersonalDetails,
  validateProfileDetails,
} from "../validators/registrationValidator";
import { REGISTRATION_ERRORS } from "../constants/authErrorMessages";
import { API_BASE } from "../constants/authConstants";

////////////////////////////////////////////////////////////////////////////////
// ===== Handle Registration Submission (uses getPublicConfig) ============== //
////////////////////////////////////////////////////////////////////////////////

const handleSubmitRegistration = async (e, formData, setters) => {
  e.preventDefault();
  setters.setError("");
  setters.setSuccessMessage("");

  // ========================= FORM VALIDATION ========================= //
  // Validate personal details
  const personalValidation = validatePersonalDetails({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  if (!personalValidation.success) {
    setters.setError(personalValidation.error);
    return;
  }

  // Validate profile details
  const profileValidation = validateProfileDetails({
    nickname: formData.nickname,
  });

  if (!profileValidation.success) {
    setters.setError(profileValidation.error);
    return;
  }

  // ========================= FORM DATA PREPARATION ========================= //
  // Prepare form data for submission

  const submitData = new FormData();
  // Personal details
  submitData.append("firstName", formData.firstName);
  submitData.append("lastName", formData.lastName);
  submitData.append("email", formData.email);
  submitData.append("password", formData.password);
  submitData.append("confirmPassword", formData.confirmPassword);
  // Profile details
  submitData.append("nickname", formData.nickname);
  submitData.append("address", formData.address || "");
  submitData.append("addressLine2", formData.addressLine2 || "");
  submitData.append("city", formData.city || "");
  submitData.append("state", formData.stateName || "");
  submitData.append("zipCode", formData.zipCode || "");

  if (formData.avatar) {
    submitData.append("avatar", formData.avatar);
  }

  // ========================= API CALL ========================= //
  try {
    const response = await axios.post(`${API_BASE}/api/register`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // ========================= SUCCESS HANDLING ========================= //
    if (response.status === 201) {
      console.log("Full registration response:", response);

      // Basic validation of response structure
      if (!response.data || !response.data.user || !response.data.user.id) {
        setters.setError(REGISTRATION_ERRORS.INVALID_RESPONSE);
        console.error("Invalid response format:", response.data);
        return;
      }

      // Simplified avatar handling - normalize to absolute URL
      const avatarPathRaw = response.data.user.avatar || "";
      const avatarPath =
        avatarPathRaw && !avatarPathRaw.startsWith("http")
          ? `${API_BASE.replace(/\/+$/,"")}${avatarPathRaw}`
          : avatarPathRaw;

      const newUser = {
        id: response.data.user.id,
        firstName: response.data.user.firstName || formData.firstName,
        lastName: response.data.user.lastName || formData.lastName,
        email: response.data.user.email || formData.email,
        nickname: response.data.user.nickname || formData.nickname,
        avatar: avatarPath,
        address: response.data.user.address || "",
        addressLine2: response.data.user.addressLine2 || "",
        city: response.data.user.city || "",
        state: response.data.user.state || "",
        zipCode: response.data.user.zipCode || "",
      };
      setters.setUser(newUser); // Set user in context

      setters.setRegistrationSuccess(true); // Set registration success state

      // ========================= ERROR HANDLING (API Level) ========================= //
    } else {
      setters.setError(
        response.data?.message ||
          `Registration attempt returned status ${response.status}`
      );
    }
    // ========================= ERROR HANDLING (Catch Block) ========================= //
  } catch (registerError) {
    console.error("Full registration error:", registerError);
    console.error("Response data:", registerError.response?.data);
    setters.setError(
      registerError.response?.data?.message ||
        registerError.message ||
        REGISTRATION_ERRORS.REGISTRATION_FAILED
    );
  }
};

export default handleSubmitRegistration;
