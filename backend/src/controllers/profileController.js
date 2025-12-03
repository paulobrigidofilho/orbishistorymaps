///////////////////////////////////////
// ======= PROFILE CONTROLLER ====== //
///////////////////////////////////////

// This controller handles user profile retrieval and updates

// ======= Module imports ======= //

const { getUserProfile, updateUserProfile } = require("../services/profileService");
const { handleServerError } = require("../helpers/handleServerError");

// ====== Get Profile Function ====== //

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(
      `GET /api/profile/${userId} requested. Session user:`,
      req.session?.user?.id || null
    );

    const userProfile = await getUserProfile(userId);
    console.log("Profile retrieved successfully:", userProfile);
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

// ====== Update Profile Function ====== //

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
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: result.user });
  } catch (error) {
    return handleServerError(res, error, "Profile update error");
  }
};

module.exports = { getProfile, updateProfile };
