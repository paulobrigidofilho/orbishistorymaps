/////////////////////////////////////
// ======= AUTH CONTROLLER ======= //
/////////////////////////////////////

// DEPRECATED: This controller is kept only for reference.
// The application now uses modular controllers:
// - registerUserService.js + register controller in routes/registerUserRoutes.js
// - loginUserService.js + login controller in routes/loginUserRoutes.js
// - profileService.js + profile controller in routes/profileRoutes.js
// - avatarService.js + avatar controller in routes/avatarRoutes.js

// This controller manages user authentication processes
// including registration, login, logout, profile retrieval and updates,
// as well as avatar uploads.

// ======= Module imports ======= //
const config = require("../config/config");
const { handleServerError } = require("../helpers/handleServerError");
const { registerUser } = require("../services/registerUserService");
const { loginUser } = require("../services/loginUserService");
const { getUserProfile, updateUserProfile } = require("../services/profileService");
const { saveAvatarUrl, deleteUserAvatar } = require("../services/avatarService");

/////////////////////////////////////////////////////////////////////
// ======================= CONTROLLER FUNCTIONS ================== //
/////////////////////////////////////////////////////////////////////

// ======================== REGISTER USER ======================== //
const register = async (req, res) => {
  console.log("Register request received!");
  // Removed full body log to avoid exposing plaintext password
  if (req.body && req.body.email) {
    console.log("Incoming registration for email:", req.body.email);
  }

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      nickname,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    } = req.body;

    // Get avatar path if a file was uploaded (store absolute URL like profile upload)
    const avatarPath = req.file
      ? await saveAvatarUrl(req.file.filename)
      : null;

    const userProfile = await registerUser({
      firstName,
      lastName,
      email,
      password,
      nickname,
      avatar: avatarPath, // now absolute URL
      address,
      addressLine2,
      city,
      state,
      zipCode,
    });

    // Establish session so owner-protected routes work immediately
    if (req.session) {
      req.session.user = userProfile;
    }

    console.log("User profile after registration:", userProfile); // Debugging log

    return res.status(201).json({
      message: "User registered successfully",
      user: userProfile,
    });
  } catch (error) {
    if (
      error.message === "This email is already in use." ||
      error.message === "Missing required fields"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return handleServerError(res, error, "Registration error");
  }
};

// ======================== UPLOAD AVATAR ======================== //
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file provided" });
    }

    // Always use userId from params for profile avatar upload
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "No user ID provided for avatar upload" });
    }

    const avatarUrl = await saveAvatarUrl(req.file.filename);
    await updateUserProfile(userId, { avatar: avatarUrl });

    // Fetch updated user profile
    const updatedUser = await getUserProfile(userId);

    console.log("Avatar uploaded and user profile updated successfully");
    return res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: avatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    return handleServerError(res, error, "Avatar upload error");
  }
};

// ======================== LOGIN USER ========================= //
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const userProfile = await loginUser({ email, password });

    // Persist user in session
    if (req.session) {
      req.session.user = userProfile;
    }

    console.log("Login successful. Sending user profile:", userProfile);
    return res
      .status(200)
      .json({ message: "Login successful", user: userProfile });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return handleServerError(res, error, "Login error");
  }
};

// ======================== LOGOUT USER ========================= //
const logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: "No active session" });
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    const cookieName = config.authConfig.session.cookieName;
    res.clearCookie(cookieName);
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// ======================== GET SESSION (current user) ========================= //
const getSession = (req, res) => {
  try {
    console.log("GET /api/session called. Session exists:", !!req.session);
    console.log("Session user:", req.session?.user?.id || "No user in session");

    if (!req.session) {
      console.error(
        "Session object is undefined! Session middleware not mounted or store connection failed."
      );
      return res.status(500).json({ message: "Session initialization error." });
    }

    if (req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(200).json({ user: null });
  } catch (err) {
    console.error("Session error:", err);
    return handleServerError(res, err, "Get session error");
  }
};

// ======================== GET PROFILE ========================= //
const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // DEBUG: log incoming request id for troubleshooting
    console.log(
      `GET /api/profile/${userId} requested. Session user:`,
      req.session && req.session.user ? req.session.user.id : null
    );

    const userProfile = await getUserProfile(userId);

    console.log(
      "Profile retrieved successfully for userId:",
      userId,
      "->",
      userProfile
    );
    return res
      .status(200)
      .json({ message: "Profile retrieved successfully", user: userProfile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    if (error.message === "Profile not found") {
      return res.status(404).json({ message: "Profile not found" });
    }
    return handleServerError(res, error, "Get profile error");
  }
};

// ======================== UPDATE PROFILE ===================== //
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      firstName,
      lastName,
      email,
      nickname,
      avatar,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    } = req.body;

    // Get avatar path from file upload if present
    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : avatar;

    const result = await updateUserProfile(userId, {
      firstName,
      lastName,
      email,
      nickname,
      avatar: avatarPath,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    });

    console.log("Profile updated successfully:", result);
    return res.status(200).json({
      message: "Profile updated successfully",
      user: result.user, // Include the updated user profile in the response
    });
  } catch (error) {
    return handleServerError(res, error, "Profile update error");
  }
};

// ======================== DELETE AVATAR ======================== //
const deleteAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    const updatedUser = await deleteUserAvatar(userId);
    return res.status(200).json({
      message: "Avatar deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    return handleServerError(res, error, "Avatar delete error");
  }
};

///////////////////////////////////////////////////////////////////////
// ========================= EXPORT CONTROLLER ===================== //
///////////////////////////////////////////////////////////////////////

const authController = {
  register,
  uploadAvatar,
  login,
  logout,
  getSession,
  getProfile,
  updateProfile,
  deleteAvatar, // added
};

module.exports = authController;
