///////////////////////////////////////////////////////////////////////
// ================ REGISTER USER SERVICE (SEQUELIZE) ============== //
///////////////////////////////////////////////////////////////////////

// This service handles the registration logic for new users
// including validation, password hashing, and user creation in the database

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

// ======= Model Imports ======= //
const { User } = require("../models");

// ======= Constants Imports ======= //
const { REGISTRATION_ERRORS } = require("../constants/errorMessages");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

// ======= Bcrypt Configuration ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

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
    throw new Error(REGISTRATION_ERRORS.MISSING_FIELDS);
  }

  // Check if email already exists using Sequelize
  const existingUser = await User.findOne({
    where: { user_email: email },
  });

  if (existingUser) {
    throw new Error(REGISTRATION_ERRORS.EMAIL_IN_USE);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = uuidv4();

  // Create user in database using Sequelize
  const newUser = await User.create({
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
    user_role: "user",
    user_status: "active",
  });

  console.log(`User created successfully with ID: ${userId}`);

  // Create user profile from Sequelize model
  const userProfile = createUserProfile(newUser.toJSON());
  console.log("Registration complete. User profile:", {
    ...userProfile,
    id: userProfile.id,
  });

  return userProfile;
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = { registerUser };
