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

const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== "string") {
    throw new Error("Invalid filename provided");
  }
  
  // Extract only the basename to prevent directory traversal
  const sanitized = path.basename(filename);
  
  // Additional check: ensure no path separators remain
  if (sanitized !== filename) {
    console.error("[sanitizePath] Path traversal attempt detected and blocked:", filename);
    throw new Error("Invalid filename: path traversal attempt detected");
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
