/////////////////////////////////////////////////
// ============== AVATAR SERVICE ============= //
/////////////////////////////////////////////////

// This service manages avatar storage, retrieval, and deletion,
// interacting with the file system and user model.

// ======= Module Imports ======= //
const path = require("path");
const fs = require("fs").promises; // Use promises API for async operations
const fsSync = require("fs"); // Keep sync API only for existsSync check

// ======= Helper Imports ======= //
const { getUserByIdAsync } = require("../helpers/getUserByIdAsync");
const { sanitizeFilename } = require("../helpers/sanitizePath");

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
    process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000";
  const relativePath = `/uploads/avatars/${filename}`;
  const absolutePath = path.resolve(
    __dirname,
    "../../uploads/avatars",
    filename
  );

  // Verify file exists on disk before returning URL
  if (!fsSync.existsSync(absolutePath)) {
    console.error(
      "[avatar] File not found on disk after upload:",
      absolutePath
    );
    throw new Error("Avatar file not found after upload");
  }

  console.log("[avatar] File verified on disk:", absolutePath);
  return `${base}${relativePath}`;
};

// ===== deleteUserAvatar Function ===== //
// Deletes avatar file from disk and clears avatar URL in user profile

const deleteUserAvatar = async (userId) => {
  const user = await getUserByIdAsync(userId);
  if (!user) throw new Error("User not found");

  const rel = toRelativeAvatarPath(user.user_avatar);
  if (rel && rel.includes("/uploads/avatars/")) {
    // Sanitize path using helper
    const filename = sanitizeFilename(rel);
    const absolute = path.resolve(
      __dirname,
      "../../uploads/avatars/",
      filename
    );
    try {
      // Use async unlink instead of sync
      if (fsSync.existsSync(absolute)) {
        await fs.unlink(absolute);
        console.log("[avatar] Deleted file:", absolute);
      } else {
        console.warn("[avatar] File not found for deletion:", absolute);
      }
    } catch (e) {
      console.warn("[avatar] Failed to delete file (continuing):", e.message);
    }
  }

  // Clear avatar in DB and return updated profile
  await updateUserProfile(userId, { avatar: "" });
  const updated = await getUserProfile(userId);
  return updated;
};

module.exports = { saveAvatarUrl, deleteUserAvatar };
