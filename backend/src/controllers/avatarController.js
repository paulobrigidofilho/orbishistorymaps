////////////////////////////////////////
// ======= AVATAR CONTROLLER ======= ///
////////////////////////////////////////

// This controller handles avatar upload and deletion

// ======= Module Imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { saveAvatarUrl, deleteUserAvatar } = require("../services/avatarService");
const { updateUserProfile, getUserProfile } = require("../services/profileService");

// ====== Upload Avatar Function ====== //

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file provided" });
    }
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: "No user ID provided for avatar upload" });

    const avatarUrl = await saveAvatarUrl(req.file.filename);
    console.log("[uploadAvatar] Persisting avatar URL:", avatarUrl);
    await updateUserProfile(userId, { avatar: avatarUrl });

    const updatedUser = await getUserProfile(userId);
    return res.status(200).json({ message: "Avatar uploaded successfully", avatar: avatarUrl, user: updatedUser });
  } catch (error) {
    return handleServerError(res, error, "Avatar upload error");
  }
};

// ====== Delete Avatar Function ====== //

const deleteAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ message: "No user ID provided" });
    const updatedUser = await deleteUserAvatar(userId);
    return res.status(200).json({ message: "Avatar deleted successfully", user: updatedUser });
  } catch (error) {
    return handleServerError(res, error, "Avatar delete error");
  }
};

module.exports = { uploadAvatar, deleteAvatar };
