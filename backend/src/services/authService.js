/////////////////////////////////////////////////
// ================== AUTH SERVICE =========== //
/////////////////////////////////////////////////

// This service handles user authentication logic,
// including registration, login, profile management, and avatar handling.

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");
const path = require("path");
const fs = require("fs");

// ======= BCRYPT CONFIGURATION ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////////////////////////////////////////
// ========================= HELPER FUNCTIONS ====================== //
///////////////////////////////////////////////////////////////////////

// Function to create a user profile object (removes sensitive data)
const createUserProfile = (user) => {
  // Removed raw user dump to avoid leaking hashed password
  return {
    id: user.user_id,
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

// Normalize an avatar value (absolute URL or relative path) to a relative uploads path
const toRelativeAvatarPath = (avatarValue) => {
  if (!avatarValue) return null;
  try {
    if (avatarValue.startsWith("http")) {
      const urlObj = new URL(avatarValue);
      return urlObj.pathname; // e.g. /uploads/avatars/filename.jpg
    }
    return avatarValue; // already relative
  } catch {
    return avatarValue;
  }
};

/////////////////////////////////////////////////////////////////////
// ======================= SERVICE FUNCTIONS ===================== //
/////////////////////////////////////////////////////////////////////

// ======================== REGISTER USER ======================== //
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

// ======================== LOGIN USER ========================= //
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  return new Promise((resolve, reject) => {
    userModel.getUserByEmail(email, async (err, user) => {
      if (err) {
        console.error("Error in getUserByEmail (login):", err);
        return reject(err);
      }

      if (!user) {
        return reject(new Error("Invalid credentials"));
      }

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          user.user_password
        );

        if (!passwordMatch) {
          return reject(new Error("Invalid credentials"));
        }

        const userProfile = createUserProfile(user);
        resolve(userProfile);
      } catch (compareError) {
        console.error("Error comparing passwords:", compareError);
        reject(compareError);
      }
    });
  });
};

// ======================== GET PROFILE ========================= //
const getUserProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, (err, user) => {
      if (err) {
        console.error("Error in getUserById:", err);
        return reject(err);
      }

      if (!user) {
        return reject(new Error("Profile not found"));
      }

      const userProfile = createUserProfile(user);
      resolve(userProfile);
    });
  });
};

// ======================== UPDATE PROFILE ===================== //
const updateUserProfile = async (userId, profileData) => {
  return new Promise((resolve, reject) => {
    // Fetch existing user first
    userModel.getUserById(userId, (fetchErr, existingUser) => {
      if (fetchErr) {
        console.error("Error fetching user before update:", fetchErr);
        return reject(fetchErr);
      }
      if (!existingUser) {
        return reject(new Error("User not found for update"));
      }

      // Merge existing fields with new profileData
      const mergedProfile = {
        user_firstname: profileData.firstName ?? existingUser.user_firstname,
        user_lastname: profileData.lastName ?? existingUser.user_lastname,
        user_email: profileData.email ?? existingUser.user_email,
        user_nickname: profileData.nickname ?? existingUser.user_nickname,
        user_avatar: profileData.avatar ?? existingUser.user_avatar,
        user_address: profileData.address ?? existingUser.user_address,
        user_address_line_2:
          profileData.addressLine2 ?? existingUser.user_address_line_2,
        user_city: profileData.city ?? existingUser.user_city,
        user_state: profileData.state ?? existingUser.user_state,
        user_zipcode: profileData.zipCode ?? existingUser.user_zipcode,
      };

      // Update user in database
      userModel.updateUser(userId, mergedProfile, (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return reject(err);
        }

        // After updating, fetch the updated user profile
        userModel.getUserById(userId, (fetchErr2, user) => {
          if (fetchErr2) {
            console.error("Error fetching user after update:", fetchErr2);
            return reject(fetchErr2);
          }

          if (!user) {
            return reject(new Error("User not found after update"));
          }

          const userProfile = createUserProfile(user);
          resolve({ result, user: userProfile });
        });
      });
    });
  });
};

// ======================== UPLOAD AVATAR ======================== //
const saveAvatarUrl = async (filename) => {
  const base =
    process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000";
  const relativePath = `/uploads/avatars/${filename}`;
  const absolutePath = path.resolve(__dirname, "../../uploads/avatars", filename);

  // Verify file physically exists
  if (!fs.existsSync(absolutePath)) {
    console.warn("[avatar] File was expected but not found on disk:", absolutePath);
  } else {
    console.log("[avatar] File stored:", absolutePath);
  }

  // Store absolute URL (frontend friendly)
  return `${base}${relativePath}`;
};

// Delete avatar on disk and clear DB path
const deleteUserAvatar = async (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, async (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("User not found"));

      const rel = toRelativeAvatarPath(user.user_avatar);
      if (rel && rel.includes("/uploads/avatars/")) {
        const absolute = path.resolve(
          __dirname,
          "../../",
          rel.replace(/^\/+/, "")
        );
        try {
          if (fs.existsSync(absolute)) {
            fs.unlinkSync(absolute);
            console.log("[avatar] Deleted file:", absolute);
          } else {
            console.warn("[avatar] File not found for deletion:", absolute);
          }
        } catch (e) {
          console.warn("[avatar] Failed to delete file (continuing):", e.message);
        }
      }

      try {
        // Clear avatar in DB
        await updateUserProfile(userId, { avatar: "" });
        const updated = await getUserProfile(userId);
        resolve(updated);
      } catch (e) {
        reject(e);
      }
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  saveAvatarUrl,
  createUserProfile,
  deleteUserAvatar, // added export
};
