/////////////////////////////////////////////
// ======= SANITIZE PATH HELPER ========== //
/////////////////////////////////////////////

// This helper provides path sanitization utilities to prevent directory traversal attacks

// ======= Module Imports ======= //
const path = require("path");

///////////////////////////////////
// ===== HELPER FUNCTIONS ====== //
///////////////////////////////////

// ===== sanitizeFilename Function ===== //
// Ensures a filename contains no directory separators or path traversal sequences
// Returns only the base filename, stripping any path components
// Accepts full paths or URLs and safely extracts just the filename

const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== "string") {
    throw new Error("Invalid filename provided");
  }
  
  // Extract only the basename to prevent directory traversal
  const sanitized = path.basename(filename);
  
  // Check for empty result or dangerous patterns in the sanitized name
  if (!sanitized || sanitized === "." || sanitized === "..") {
    console.error("[sanitizePath] Invalid filename after sanitization:", filename);
    throw new Error("Invalid filename: path traversal attempt detected");
  }
  
  // Check for any remaining path separators or null bytes in the sanitized name
  if (sanitized.includes("\0") || sanitized.includes("/") || sanitized.includes("\\")) {
    console.error("[sanitizePath] Dangerous characters in filename:", sanitized);
    throw new Error("Invalid filename: dangerous characters detected");
  }
  
  return sanitized;
};

// ===== isValidFilename Function ===== //
// Validates that a filename is safe without modification
// Returns true if the filename equals its basename (no path components)

const isValidFilename = (filename) => {
  if (!filename || typeof filename !== "string") {
    return false;
  }
  return path.basename(filename) === filename;
};

module.exports = { sanitizeFilename, isValidFilename };
