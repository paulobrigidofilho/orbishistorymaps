////////////////////////////////////////
// ======= AVATAR CONTROLLER ======= ///
////////////////////////////////////////

// This controller handles avatar upload and deletion

// ======= Module Imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { isValidFilename } = require("../helpers/sanitizePath");
const { AVATAR_ERRORS } = require("../constants/errorMessages");
const { AVATAR_SUCCESS } = require("../constants/successMessages");
const {
  saveAvatarUrl,
  deleteUserAvatar,
} = require("../services/avatarService");
const path = require("path");
const fs = require("fs");

// ====== Upload Avatar Function ====== //

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: AVATAR_ERRORS.NO_FILE_PROVIDED });
    }
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: AVATAR_ERRORS.NO_USER_ID_PROVIDED });
    }

    const avatarUrl = await saveAvatarUrl(req.file.filename);
    console.log("[uploadAvatar] Persisting avatar URL:", avatarUrl);
    const { user: updatedUser } = await updateUserProfile(userId, {
      avatar: avatarUrl,
    });

    return res
      .status(200)
      .json({
        message: AVATAR_SUCCESS.AVATAR_UPLOADED,
        avatar: avatarUrl,
        user: updatedUser,
      });
  } catch (error) {
    return handleServerError(res, error, "Avatar upload error");
  }
};

// ====== Delete Avatar Function ====== //

const deleteAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: AVATAR_ERRORS.NO_USER_ID_PROVIDED });
    }
    const updatedUser = await deleteUserAvatar(userId);
    return res
      .status(200)
      .json({ message: AVATAR_SUCCESS.AVATAR_DELETED, user: updatedUser });
  } catch (error) {
    return handleServerError(res, error, "Avatar delete error");
  }
};

// ====== Serve Avatar Function ====== //

const serveAvatar = (req, res) => {
  try {
    const file = req.params.filename;

    if (!isValidFilename(file)) {
      return res.status(400).json({ message: AVATAR_ERRORS.INVALID_FILENAME });
    }

    const full = path.resolve(__dirname, "../../uploads/avatars", file);
    fs.access(full, fs.constants.R_OK, (err) => {
      if (err) return res.status(404).json({ message: AVATAR_ERRORS.AVATAR_NOT_FOUND });
      res.sendFile(full);
    });
  } catch (error) {
    return handleServerError(res, error, "Avatar serve error");
  }
};

module.exports = { uploadAvatar, deleteAvatar, serveAvatar };
