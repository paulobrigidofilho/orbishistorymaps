////////////////////////////////////////////////
// ======= COMPRESS AVATAR HELPER ============ //
////////////////////////////////////////////////

// This helper compresses and resizes avatar images to optimize storage
// Ensures all avatars are standardized to 720x720 pixels and under 100KB

// ======= Module Imports ======= //
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

///////////////////////////////////
// ===== HELPER FUNCTIONS ====== //
///////////////////////////////////

// ===== compressAvatar Function ===== //
// Compresses an uploaded avatar image to 720x720 pixels with optimized quality
// Returns the path to the compressed file

const compressAvatar = async (filePath) => {
  try {
    console.log("[compressAvatar] Starting compression for:", filePath);

    // Verify file exists
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      throw new Error("Avatar file not found for compression");
    }

    // Define target dimensions and quality
    const TARGET_SIZE = 720;
    const TARGET_MAX_SIZE_KB = 100;
    const TARGET_MAX_SIZE_BYTES = TARGET_MAX_SIZE_KB * 1024;

    // Get original file extension
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);

    // Generate compressed filename
    const compressedFilename = `${basename}-compressed.jpg`;
    const compressedPath = path.join(dir, compressedFilename);

    // Start with quality 90 for JPG
    let quality = 90;
    let compressedSize = Infinity;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    // Iteratively compress until file is under target size
    while (compressedSize > TARGET_MAX_SIZE_BYTES && attempts < MAX_ATTEMPTS) {
      await sharp(filePath)
        .resize(TARGET_SIZE, TARGET_SIZE, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality, mozjpeg: true })
        .toFile(compressedPath);

      // Check compressed file size
      const stats = await fs.stat(compressedPath);
      compressedSize = stats.size;

      console.log(
        `[compressAvatar] Attempt ${attempts + 1}: Quality ${quality}%, Size: ${(compressedSize / 1024).toFixed(2)} KB`
      );

      // Reduce quality for next attempt if needed
      if (compressedSize > TARGET_MAX_SIZE_BYTES) {
        quality -= 10;
        attempts++;
      }
    }

    // Delete original file after successful compression
    await fs.unlink(filePath);
    console.log("[compressAvatar] Original file deleted:", filePath);

    // Rename compressed file to original filename (but keep .jpg extension)
    const finalPath = path.join(dir, `${basename}.jpg`);
    await fs.rename(compressedPath, finalPath);

    console.log(
      `[compressAvatar] Compression complete: ${(compressedSize / 1024).toFixed(2)} KB at quality ${quality}%`
    );
    console.log("[compressAvatar] Final file:", finalPath);

    return {
      path: finalPath,
      filename: `${basename}.jpg`,
      size: compressedSize,
      quality,
    };
  } catch (error) {
    console.error("[compressAvatar] Compression failed:", error);
    throw new Error(`Avatar compression failed: ${error.message}`);
  }
};

module.exports = { compressAvatar };
