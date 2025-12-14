/////////////////////////////////////////////////////
// ============= REGISTER USER SERVICE =========== //
/////////////////////////////////////////////////////

// This service handles the registration logic for new users
// including validation, password hashing, and user creation in the database

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");
const { getUserByEmailAsync } = require("../helpers/getUserByEmailAsync");
const { createUserAsync } = require("../helpers/createUserAsync");

// ======= Bcrypt Configuration ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== registerUser Function ===== //
// Registers a new user with the provided data

const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    nickname,
    avatar,
    address,
    city,
    state,
    zipCode,
    addressLine2,
  } = userData;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw new Error("Missing required fields");
  }

  // Check if email already exists
  const existingUser = await getUserByEmailAsync(email);
  if (existingUser) {
    throw new Error("This email is already in use.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = uuidv4();

  const newUser = {
    user_id: userId,
    user_firstname: firstName,
    user_lastname: lastName,
    user_email: email,
    user_password: hashedPassword,
    user_nickname: nickname || "",
    user_avatar: avatar || "",
    user_address: address || "",
    user_address_line_2: addressLine2 || "",
    user_city: city || "",
    user_state: state || "",
    user_zipcode: zipCode || "",
  };

  // Create user in database
  const createResult = await createUserAsync(newUser);

  // Verify the insert actually happened
  if (!createResult || createResult.affectedRows === 0) {
    throw new Error("Failed to create user in database");
  }

  console.log(
    `User created successfully. Affected rows: ${createResult.affectedRows}`
  );

  // Fetch the complete user profile from the database
  const user = await getUserByEmailAsync(email);
  if (!user) {
    throw new Error("User registered but not found");
  }

  const userProfile = createUserProfile(user);
  console.log("Registration complete. User profile:", {
    ...userProfile,
    id: userProfile.id,
  });
  return userProfile;
};

module.exports = { registerUser };
