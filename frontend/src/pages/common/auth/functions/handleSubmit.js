import axios from "axios";
import { 
  validatePersonalDetails, 
  validateProfileDetails 
} from "../validators/registrationValidator";

///////////////////////////////////////
// ===== HANDLE SUBMIT FUNCTION ===== //
///////////////////////////////////////

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
const handleSubmit = async (e, formData, setters) => {
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
    confirmPassword: formData.confirmPassword
  });
  
  if (!personalValidation.success) {
    setters.setError(personalValidation.error);
    return;
  }
  
  // Validate profile details
  const profileValidation = validateProfileDetails({
    nickname: formData.nickname
  });
  
  if (!profileValidation.success) {
    setters.setError(profileValidation.error);
    return;
  }

  // ========================= FORM DATA PREPARATION ========================= //
  const submitData = new FormData();
  // Personal details
  submitData.append("firstName", formData.firstName);
  submitData.append("lastName", formData.lastName);
  submitData.append("email", formData.email);
  submitData.append("password", formData.password);
  submitData.append("confirmPassword", formData.confirmPassword);
  // Profile details
  submitData.append("nickname", formData.nickname);
  submitData.append("address", formData.address);          
  submitData.append("addressLine2", formData.addressLine2);
  submitData.append("city", formData.city);
  submitData.append("state", formData.stateName); 
  submitData.append("zipCode", formData.zipCode);

  // Append avatar only if selected
  if (formData.avatar) {
    submitData.append("avatar", formData.avatar);
  }

  // ========================= API CALL ========================= //
  try {
    // Use environment variable for API URL
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, submitData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Include cookies in the request
    });

    // ========================= SUCCESS HANDLING ========================= //
    if (response.status === 201) {
      console.log("Full registration response:", response);

      // Basic validation of response structure
      if (!response.data || !response.data.user || !response.data.user.id) {
        setters.setError("Registration successful, but invalid user data received. Check backend response.");
        console.error("Invalid response format:", response.data);
        return;
      }

      // ========================= SET USER CONTEXT ========================= //
      // Construct user object for context using data from response
      const newUser = {
        id: response.data.user.id,
        firstName: response.data.user.firstName || formData.firstName,
        lastName: response.data.user.lastName || formData.lastName,
        email: response.data.user.email || formData.email,
        nickname: response.data.user.nickname || formData.nickname,
        avatar: response.data.user.avatar.startsWith('http')
                ? response.data.user.avatar
                : `${process.env.REACT_APP_API_URL}${response.data.user.avatar}`,
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
      setters.setError(response.data?.message || `Registration attempt returned status ${response.status}`);
    }
    // ========================= ERROR HANDLING (Catch Block) ========================= //
  } catch (registerError) {
    console.error("Full registration error:", registerError);
    console.error("Response data:", registerError.response?.data);
    setters.setError(
      registerError.response?.data?.message ||
        registerError.message ||
        "Registration failed due to a network or server issue."
    );
  }
};

export default handleSubmit;
