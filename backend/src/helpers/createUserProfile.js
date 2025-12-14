/////////////////////////////////////////////////////////
// ============= CREATE USER PROFILE HELPER ========== //
/////////////////////////////////////////////////////////

// This helper creates a user profile object excluding sensitive information

// ===== createUserProfile Function ===== //

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
  };
};

module.exports = { createUserProfile };
