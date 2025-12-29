///////////////////////////////////////////////////////////////////////
// =============== VALIDATE USER EDIT FORM FUNCTION ================== //
///////////////////////////////////////////////////////////////////////

// This function validates the user edit form fields

///////////////////////////////////////////////////////////////////////
// ================== VALIDATE USER EDIT FORM ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates user edit form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} errors - Object containing validation errors
 */
const validateUserEditForm = (formData) => {
  const errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  // Validate password match if password is being changed
  if (formData.password.trim() !== "") {
    // Check minimum length (8 characters)
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(formData.password)) {
      errors.password = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Check for number
    if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};

export default validateUserEditForm;
