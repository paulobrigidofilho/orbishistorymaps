///////////////////////////////////////////////////////////////////////
// ============== GET CHANGED USER FIELDS FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

// This function compares form data with original user data and returns only changed fields

///////////////////////////////////////////////////////////////////////
// ================= GET CHANGED USER FIELDS ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Gets only the fields that have been changed
 * @param {Object} formData - Current form data
 * @param {Object} user - Original user data
 * @returns {Object} changes - Object containing only changed fields
 */
const getChangedUserFields = (formData, user) => {
  const changes = {};
  
  Object.keys(formData).forEach((key) => {
    // Skip confirmPassword - it's only for validation
    if (key === "confirmPassword") {
      return;
    }
    
    // Skip password if empty (not being changed)
    if (key === "password") {
      if (formData.password.trim() !== "") {
        changes.password = formData.password;
      }
    } else if (formData[key] !== (user[key] || "")) {
      changes[key] = formData[key];
    }
  });

  return changes;
};

export default getChangedUserFields;
