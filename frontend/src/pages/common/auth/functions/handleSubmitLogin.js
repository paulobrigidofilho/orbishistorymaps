/////////////////////////////////////
// ===== HANDLE LOGIN SUBMIT ===== //
/////////////////////////////////////

// This function handles the login form submission, validating credentials
// and managing the authentication flow with error handling.

import { AUTH_ERRORS } from "../constants/authErrorMessages";

/**
 * Handle login form submission
 * @param {Event} e - The form submission event
 * @param {Object} credentials - The login credentials { email, password }
 * @param {Function} login - The login function from AuthContext
 * @param {Function} setError - Function to set error message
 * @param {Function} onClose - Function to close the modal on success
 */

const handleSubmitLogin = async (e, credentials, login, setError, onClose) => {
  e.preventDefault();
  setError("");

  try {
    await login(credentials.email, credentials.password);
    onClose(); // Close the modal on successful login
  } catch (error) {
    setError(
      error.response?.data?.message ||
      error.message ||
      AUTH_ERRORS.LOGIN_FAILED
    );
  }
};

export default handleSubmitLogin;
