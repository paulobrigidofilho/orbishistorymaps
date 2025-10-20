//////////////////////////////////
// ===== HANDLE LOGIN SUBMIT ===== //
//////////////////////////////////

// This function handles the login form submission, validating credentials
// and managing the authentication flow with error handling.

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
  
  try {
    await login(credentials.email, credentials.password);
    onClose(); // Close the modal on successful login
  } catch (err) {
    console.error('Login error:', err);
    setError(err.message || 'Login failed');
  }
};

export default handleSubmitLogin;
