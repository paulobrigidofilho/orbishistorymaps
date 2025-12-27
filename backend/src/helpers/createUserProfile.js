/////////////////////////////////////////////////////////
// ============= CREATE USER PROFILE HELPER ========== //
/////////////////////////////////////////////////////////

// This helper creates a user profile object excluding sensitive information

// ===== createUserProfile Function ===== //
// Note: Converts user_id to String for consistent ID type across frontend/backend.
// This ensures strict equality (===) comparisons work correctly in the frontend
// without type coercion issues (e.g., "123" === "123" instead of "123" !== 123).

const createUserProfile = (user) => {
  return {
    id: String(user.user_id), 
    firstName: user.user_firstname || "",
    lastName: user.user_lastname || "",
    email: user.user_email || "",
    nickname: user.user_nickname || "",
    avatar: user.user_avatar || "",
    address: user.user_address || "",
    addressLine2: user.user_address_line_2 || "",
    city: user.user_city || "",
    state: user.user_state || "",
    zipCode: user.user_zipcode || "",
    role: user.user_role || "user",
    status: user.user_status || "active",
  };
};

module.exports = { createUserProfile };
