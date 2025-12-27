///////////////////////////////////////////////////
// ===== COMPRESS PRODUCT IMAGE HELPER ========= //
///////////////////////////////////////////////////

// This helper compresses and resizes product images following e-commerce standards
// Creates multiple sizes similar to Amazon: thumbnail, medium, large, original
// Optimizes storage while maintaining image quality for different use cases

// ======= Module Imports ======= //
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

///////////////////////////////////
// ===== HELPER FUNCTIONS ====== //
///////////////////////////////////

// ===== compressProductImage Function ===== //
// Creates multiple optimized versions of a product image
// Returns array of generated image paths with their metadata

const compressProductImage = async (filePath) => {
  try {
    console.log("[compressProductImage] Starting compression for:", filePath);

    // Verify file exists
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      throw new Error("Product image file not found for compression");
    }

    // Define image sizes (following e-commerce standards)
    const SIZES = {
      thumbnail: { width: 150, height: 150, maxSizeKB: 20 },
      small: { width: 300, height: 300, maxSizeKB: 50 },
      medium: { width: 800, height: 800, maxSizeKB: 150 },
      large: { width: 1500, height: 1500, maxSizeKB: 400 },
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

      let quality = 90;
      let fileSize = Infinity;
      let attempts = 0;
      const MAX_ATTEMPTS = 10;
      const targetMaxSize = config.maxSizeKB * 1024;

      console.log(`[compressProductImage] Processing ${sizeName} (${config.width}x${config.height})`);

      // Iteratively compress until file is under target size
      while (fileSize > targetMaxSize && attempts < MAX_ATTEMPTS) {
        await sharp(filePath)
          .resize(config.width, config.height, {
            fit: "inside", // Maintain aspect ratio, fit within dimensions
            withoutEnlargement: true, // Don't upscale smaller images
          })
          .jpeg({ quality, mozjpeg: true })
          .toFile(outputPath);

        // Check compressed file size
        const stats = await fs.stat(outputPath);
        fileSize = stats.size;

        console.log(
          `[compressProductImage] ${sizeName} - Attempt ${attempts + 1}: Quality ${quality}%, Size: ${(fileSize / 1024).toFixed(2)} KB`
        );

        // Reduce quality for next attempt if needed
        if (fileSize > targetMaxSize && quality > 60) {
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
    console.log("[compressProductImage] Original file deleted:", filePath);

    console.log("[compressProductImage] Compression complete. Generated sizes:", results.length);
    return {
      success: true,
      images: results,
      primaryFilename: results.find((img) => img.size === "large")?.filename || results[0].filename,
    };
  } catch (error) {
    console.error("[compressProductImage] Error during compression:", error);
    throw error;
  }
};

// ===== deleteProductImages Function ===== //
// Deletes all size variants of a product image

const deleteProductImages = async (baseFilename) => {
  try {
    const dir = path.resolve(__dirname, "../../uploads/products");
    const basename = path.basename(baseFilename, path.extname(baseFilename));

    // Extract original base (remove size suffix if present)
    const baseNamePattern = basename.replace(/-(thumbnail|small|medium|large)$/, "");

    const SIZES = ["thumbnail", "small", "medium", "large"];
    const deletionPromises = [];

    for (const size of SIZES) {
      const filename = `${baseNamePattern}-${size}.jpg`;
      const filePath = path.join(dir, filename);

      deletionPromises.push(
        fs
          .unlink(filePath)
          .then(() => {
            console.log(`[deleteProductImages] Deleted ${size}:`, filename);
            return { size, deleted: true };
          })
          .catch((err) => {
            if (err.code !== "ENOENT") {
              console.error(`[deleteProductImages] Error deleting ${size}:`, err);
            }
            return { size, deleted: false };
          })
      );
    }

    const results = await Promise.all(deletionPromises);
    const deletedCount = results.filter((r) => r.deleted).length;

    console.log(`[deleteProductImages] Deletion complete. Deleted ${deletedCount} files.`);
    return {
      success: true,
      deletedCount,
      results,
    };
  } catch (error) {
    console.error("[deleteProductImages] Error during deletion:", error);
    throw error;
  }
};

module.exports = {
  compressProductImage,
  deleteProductImages,
};
