///////////////////////////////////////////////////////////////////////
// ================ PASSWORD RESET SERVICE (SEQUELIZE) ============= //
///////////////////////////////////////////////////////////////////////

// This service handles password reset business logic using Sequelize ORM
// Provides token generation, validation, and password update

// ======= Module Imports ======= //
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const config = require("../config/config");

// ======= Model Imports ======= //
const { User, PasswordReset } = require("../models");

// ======= Constants Imports ======= //
const { PASSWORD_RESET_ERRORS } = require("../constants/errorMessages");

// ======= Bcrypt Configuration ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Request Password Reset ===== //
const requestPasswordReset = async (email) => {
  try {
    // Validate email exists
    const user = await User.findOne({
      where: { user_email: email },
      attributes: ["user_id", "user_email"],
    });

    if (!user) {
      throw new Error(PASSWORD_RESET_ERRORS.EMAIL_NOT_FOUND);
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store token in database
    await PasswordReset.create({
      user_id: user.user_id,
      reset_token: hashedToken,
      expires_at: expiresAt,
    });

    // In a real application, you would send an email here
    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset token (DO NOT LOG IN PRODUCTION): ${resetToken}`);

    return {
      message: "Password reset email sent",
      email: user.user_email,
      // Remove this in production - token should only be sent via email
      resetToken: resetToken,
      resetLink: `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`,
    };
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    if (error.message === PASSWORD_RESET_ERRORS.EMAIL_NOT_FOUND) {
      throw error;
    }
    throw new Error(PASSWORD_RESET_ERRORS.TOKEN_GENERATION_FAILED);
  }
};

// ===== Reset Password ===== //
const resetPassword = async (token, newPassword) => {
  try {
    // Hash the provided token to match stored format
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid token
    const resetRecord = await PasswordReset.findOne({
      where: {
        reset_token: hashedToken,
        expires_at: { [Op.gt]: new Date() },
        used_at: null,
      },
    });

    if (!resetRecord) {
      throw new Error(PASSWORD_RESET_ERRORS.INVALID_OR_EXPIRED_TOKEN);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await User.update(
      { user_password: hashedPassword },
      { where: { user_id: resetRecord.user_id } }
    );

    // Invalidate the reset token
    await resetRecord.update({ used_at: new Date() });

    return {
      message: "Password updated successfully",
      userId: resetRecord.user_id,
    };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    if (error.message === PASSWORD_RESET_ERRORS.INVALID_OR_EXPIRED_TOKEN) {
      throw error;
    }
    throw new Error(PASSWORD_RESET_ERRORS.PASSWORD_UPDATE_FAILED);
  }
};

// ===== Clean Expired Tokens ===== //
const cleanExpiredTokens = async () => {
  try {
    const deleted = await PasswordReset.destroy({
      where: {
        [Op.or]: [
          { expires_at: { [Op.lt]: new Date() } },
          { used_at: { [Op.not]: null } },
        ],
      },
    });

    console.log(`Cleaned ${deleted} expired/used password reset tokens`);
    return { deleted };
  } catch (error) {
    console.error("Error cleaning expired tokens:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  requestPasswordReset,
  resetPassword,
  cleanExpiredTokens,
};
