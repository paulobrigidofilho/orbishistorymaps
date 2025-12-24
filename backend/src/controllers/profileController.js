///////////////////////////////////////
// ======= PROFILE CONTROLLER ====== //
///////////////////////////////////////

// This controller handles user profile retrieval and updates

// ======= Module imports ======= //

const { getUserProfile, updateUserProfile } = require("../services/profileService");
const { saveAvatarUrl } = require("../services/avatarService");
const { handleServerError } = require("../helpers/handleServerError");
const { PROFILE_ERRORS } = require("../constants/errorMessages");
const { PROFILE_SUCCESS } = require("../constants/successMessages");

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
      .json({ message: PROFILE_SUCCESS.PROFILE_RETRIEVED, user: userProfile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    if (error.message === PROFILE_ERRORS.PROFILE_NOT_FOUND) {
      return res.status(404).json({ message: PROFILE_ERRORS.PROFILE_NOT_FOUND });
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

    // Get avatar path: use saveAvatarUrl for consistency with other controllers
    const avatarPath = req.file
      ? await saveAvatarUrl(req.file.filename)
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
      .json({ message: PROFILE_SUCCESS.PROFILE_UPDATED, user: result.user });
  } catch (error) {
    return handleServerError(res, error, "Profile update error");
  }
};

module.exports = { getProfile, updateProfile };
