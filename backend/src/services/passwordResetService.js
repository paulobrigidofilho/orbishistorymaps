///////////////////////////////////////////////////
// ============= PASSWORD RESET SERVICE ======== //
///////////////////////////////////////////////////

// This service handles password reset logic including
// generating tokens, sending reset emails, and updating passwords

// ======= Module Imports ======= //
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const config = require("../config/config");

// ======= Constants Imports ======= //
const { PASSWORD_RESET_ERRORS } = require("../constants/errorMessages");

// ======= Helper Imports ======= //
const { getUserByEmailAsync } = require("../helpers/getUserByEmailAsync");

// ======= Model Imports ======= //
const userModel = require("../model/userModel");
const passwordResetModel = require("../model/passwordResetModel");

// ======= Bcrypt Configuration ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== requestPasswordReset Function ===== //
// Generates a reset token and stores it in the database

const requestPasswordReset = async (email) => {
  // Validate email exists
  const user = await getUserByEmailAsync(email);
  if (!user) {
    throw new Error(PASSWORD_RESET_ERRORS.EMAIL_NOT_FOUND);
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  // Token expires in 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Store token in database
  return new Promise((resolve, reject) => {
    passwordResetModel.createResetToken(
      {
        userId: user.user_id,
        token: hashedToken,
        expiresAt: expiresAt
      },
      (err, result) => {
        if (err) {
          console.error("Error creating reset token:", err);
          return reject(new Error(PASSWORD_RESET_ERRORS.TOKEN_GENERATION_FAILED));
        }

        // In a real application, you would send an email here
        // For now, we'll return the token (in production, only send via email)
        console.log(`Password reset requested for: ${email}`);
        console.log(`Reset token (DO NOT LOG IN PRODUCTION): ${resetToken}`);
        
        resolve({
          message: "Password reset email sent",
          email: user.user_email,
          // Remove this in production - token should only be sent via email
          resetToken: resetToken,
          resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
        });
      }
    );
  });
};

// ===== resetPassword Function ===== //
// Validates token and updates user password

const resetPassword = async (token, newPassword) => {
  // Hash the provided token to match stored format
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find valid token
  return new Promise((resolve, reject) => {
    passwordResetModel.findValidToken(hashedToken, async (err, resetRecord) => {
      if (err) {
        console.error("Error finding reset token:", err);
        return reject(new Error(PASSWORD_RESET_ERRORS.INVALID_TOKEN));
      }

      if (!resetRecord) {
        return reject(new Error(PASSWORD_RESET_ERRORS.INVALID_OR_EXPIRED_TOKEN));
      }

      try {
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password
        await new Promise((resolve, reject) => {
          userModel.updatePassword(resetRecord.user_id, hashedPassword, (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return reject(new Error(PASSWORD_RESET_ERRORS.PASSWORD_UPDATE_FAILED));
            }
            resolve(result);
          });
        });

        // Invalidate the reset token
        await new Promise((resolve, reject) => {
          passwordResetModel.invalidateToken(resetRecord.reset_id, (err, result) => {
            if (err) {
              console.error("Error invalidating token:", err);
              // Don't fail the request if token invalidation fails
            }
            resolve(result);
          });
        });

        resolve({
          message: "Password updated successfully",
          userId: resetRecord.user_id
        });
      } catch (error) {
        console.error("Password reset error:", error);
        reject(error);
      }
    });
  });
};

module.exports = {
  requestPasswordReset,
  resetPassword
};
