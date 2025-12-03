/////////////////////////////////////////////////////
// ============= REGISTER USER SERVICE =========== //
/////////////////////////////////////////////////////

// This service handles the registration logic for new users
// including validation, password hashing, and user creation in the database

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

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

  return new Promise((resolve, reject) => {
    userModel.getUserByEmail(email, async (err, existingUser) => {
      if (err) {
        console.error("Error in getUserByEmail (register):", err);
        return reject(err);
      }

      if (existingUser) {
        return reject(new Error("This email is already in use."));
      }

      try {
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
        userModel.createUser(newUser, (createErr, createResult) => {
          if (createErr) {
            console.error("Error creating user:", createErr);
            return reject(createErr);
          }

          // Verify the insert actually happened
          if (!createResult || createResult.affectedRows === 0) {
            console.error(
              "User creation returned success but no rows affected"
            );
            return reject(new Error("Failed to create user in database"));
          }

          console.log(
            `User created successfully. Affected rows: ${createResult.affectedRows}`
          );

          // Fetch the complete user profile from the database
          userModel.getUserByEmail(email, (fetchErr, user) => {
            if (fetchErr) {
              console.error("Error fetching user after create:", fetchErr);
              return reject(fetchErr);
            }

            if (!user) {
              console.error("User was inserted but could not be retrieved");
              return reject(new Error("User registered but not found"));
            }

            const userProfile = createUserProfile(user);
            console.log("Registration complete. User profile:", {
              ...userProfile,
              id: userProfile.id,
            });
            resolve(userProfile);
          });
        });
      } catch (error) {
        console.error("Unexpected error in registerUser:", error);
        reject(error);
      }
    });
  });
};

module.exports = { registerUser };
