///////////////////////////////////////////////////
// ===== COMPRESS POST IMAGE HELPER ============ //
///////////////////////////////////////////////////

// This helper compresses and resizes post images for blog posts
// Creates multiple sizes for responsive display
// Optimizes storage while maintaining image quality

// ======= Module Imports ======= //
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

///////////////////////////////////
// ===== HELPER FUNCTIONS ====== //
///////////////////////////////////

// ===== compressPostImage Function ===== //
// Creates optimized versions of a post header image
// Returns the processed image filename

const compressPostImage = async (filePath) => {
  try {
    console.log("[compressPostImage] Starting compression for:", filePath);

    // Verify file exists
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      throw new Error("Post image file not found for compression");
    }

    // Define image sizes for posts (optimized for blog display)
    const SIZES = {
      thumbnail: { width: 400, height: 300, maxSizeKB: 50 },
      medium: { width: 800, height: 600, maxSizeKB: 150 },
      large: { width: 1200, height: 800, maxSizeKB: 300 },
    };

    // Get original file info
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);

    const results = [];

    // Process each size
    for (const [sizeName, config] of Object.entries(SIZES)) {
      const outputFilename = `${basename}-${sizeName}.jpg`;
      const outputPath = path.join(dir, outputFilename);

      let quality = 85;
      let fileSize = Infinity;
      let attempts = 0;
      const MAX_ATTEMPTS = 10;
      const targetMaxSize = config.maxSizeKB * 1024;

      console.log(`[compressPostImage] Processing ${sizeName} (${config.width}x${config.height})`);

      // Iteratively compress until file is under target size
      while (fileSize > targetMaxSize && attempts < MAX_ATTEMPTS) {
        await sharp(filePath)
          .resize(config.width, config.height, {
            fit: "cover", // Cover for consistent card layouts
            withoutEnlargement: true, // Don't upscale smaller images
          })
          .jpeg({ quality, mozjpeg: true })
          .toFile(outputPath);

        // Check compressed file size
        const stats = await fs.stat(outputPath);
        fileSize = stats.size;

        console.log(
          `[compressPostImage] ${sizeName} - Attempt ${attempts + 1}: Quality ${quality}%, Size: ${(fileSize / 1024).toFixed(2)} KB`
        );

        // Reduce quality for next attempt if needed
        if (fileSize > targetMaxSize && quality > 50) {
          quality -= 10;
          attempts++;
        } else {
          break; // Accept this quality
        }
      }

      results.push({
        size: sizeName,
        filename: outputFilename,
        width: config.width,
        height: config.height,
        fileSize: fileSize,
        fileSizeKB: (fileSize / 1024).toFixed(2),
      });
    }

    // Delete original uploaded file after successful compression
    await fs.unlink(filePath);
    console.log("[compressPostImage] Original file deleted:", filePath);

    console.log("[compressPostImage] Compression complete. Generated sizes:", results.length);
    
    // Return the large size as primary for posts
    return {
      success: true,
      images: results,
      primaryFilename: results.find((img) => img.size === "large")?.filename || results[0].filename,
    };
  } catch (error) {
    console.error("[compressPostImage] Error during compression:", error);
    throw error;
  }
};

// ===== deletePostImages Function ===== //
// Deletes all size variants of a post image

const deletePostImages = async (baseFilename) => {
  try {
    const dir = path.resolve(__dirname, "../../uploads/posts");
    const ext = path.extname(baseFilename);
    const basename = path.basename(baseFilename, ext);

    // Get the actual base name without size suffix
    const actualBasename = basename.replace(/-(?:thumbnail|medium|large)$/, "");

    const sizes = ["thumbnail", "medium", "large"];
    const deletedFiles = [];

    for (const size of sizes) {
      const filename = `${actualBasename}-${size}.jpg`;
      const filePath = path.join(dir, filename);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deletedFiles.push(filename);
        console.log(`[deletePostImages] Deleted: ${filename}`);
      } catch (err) {
        // File doesn't exist, skip
        console.log(`[deletePostImages] File not found (skipping): ${filename}`);
      }
    }

    console.log(`[deletePostImages] Deleted ${deletedFiles.length} image files`);
    return { deleted: deletedFiles };
  } catch (error) {
    console.error("[deletePostImages] Error during deletion:", error);
    throw error;
  }
};

module.exports = {
  compressPostImage,
  deletePostImages,
};
