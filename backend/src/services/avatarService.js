/////////////////////////////////////////////////
// ============== AVATAR SERVICE ============= //
/////////////////////////////////////////////////

// This service manages avatar storage, retrieval, and deletion,
// interacting with the file system and user model.

// ======= Module Imports ======= //
const path = require("path");
const fs = require("fs");

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

// ======= Service Imports ======= //
const { getUserProfile, updateUserProfile } = require("./profileService");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== toRelativeAvatarPath Function ===== //
// Converts absolute avatar URL to relative path for file system operations

const toRelativeAvatarPath = (avatarValue) => {
  if (!avatarValue) return null;
  try {
    if (avatarValue.startsWith("http")) {
      const urlObj = new URL(avatarValue);
      return urlObj.pathname;
    }
    return avatarValue;
  } catch {
    return avatarValue;
  }
};

// ===== saveAvatarUrl Function ===== //
// Constructs absolute URL for stored avatar based on filename and backend public URL

const saveAvatarUrl = async (filename) => {
  const base =
    process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") || "http://localhost:4000";
  const relativePath = `/uploads/avatars/${filename}`;
  const absolutePath = path.resolve(__dirname, "../../uploads/avatars", filename);

  if (!fs.existsSync(absolutePath)) {
    console.warn("[avatar] File was expected but not found on disk:", absolutePath);
  } else {
    console.log("[avatar] File stored:", absolutePath);
  }

  return `${base}${relativePath}`;
};

// ===== deleteUserAvatar Function ===== //
// Deletes avatar file from disk and clears avatar URL in user profile

const deleteUserAvatar = async (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, async (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error("User not found"));

      const rel = toRelativeAvatarPath(user.user_avatar);
      if (rel && rel.includes("/uploads/avatars/")) {
        const absolute = path.resolve(__dirname, "../../", rel.replace(/^\/+/, ""));
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
        await updateUserProfile(userId, { avatar: "" });
        const updated = await getUserProfile(userId);
        resolve(updated);
      } catch (e) {
        reject(e);
      }
    });
  });
};

module.exports = { saveAvatarUrl, deleteUserAvatar };
