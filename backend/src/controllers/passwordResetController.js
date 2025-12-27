//////////////////////////////////////////////////
// ======= PASSWORD RESET CONTROLLER ========== //
//////////////////////////////////////////////////

// This controller handles password reset requests including
// forgot password and reset password endpoints

// ======= Module imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { PASSWORD_RESET_ERRORS } = require("../constants/errorMessages");
const { PASSWORD_RESET_SUCCESS } = require("../constants/successMessages");
const { requestPasswordReset, resetPassword } = require("../services/passwordResetService");

// ====== Forgot Password Function ====== //

const forgotPassword = async (req, res) => {
  console.log("Forgot password request received!");
  
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_RESET_ERRORS.EMAIL_REQUIRED
      });
    }

    const result = await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      message: PASSWORD_RESET_SUCCESS.RESET_EMAIL_SENT,
      data: {
        email: result.email,
        // Remove resetToken and resetLink in production
        resetToken: result.resetToken,
        resetLink: result.resetLink
      }
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    
    // Don't reveal if email exists or not for security
    if (error.message === PASSWORD_RESET_ERRORS.EMAIL_NOT_FOUND) {
      return res.status(200).json({
        success: true,
        message: PASSWORD_RESET_SUCCESS.RESET_EMAIL_SENT
      });
    }

    return handleServerError(res, error, "forgotPassword");
  }
};

// ====== Reset Password Function ====== //

const resetPasswordHandler = async (req, res) => {
  console.log("Reset password request received!");
  
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_RESET_ERRORS.MISSING_FIELDS
      });
    }

    const result = await resetPassword(token, password);

    return res.status(200).json({
      success: true,
      message: PASSWORD_RESET_SUCCESS.PASSWORD_UPDATED,
      data: {
        userId: result.userId
      }
    });

  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error.message === PASSWORD_RESET_ERRORS.INVALID_OR_EXPIRED_TOKEN) {
      return res.status(400).json({
        success: false,
        message: PASSWORD_RESET_ERRORS.INVALID_OR_EXPIRED_TOKEN
      });
    }

    if (error.message === PASSWORD_RESET_ERRORS.PASSWORD_UPDATE_FAILED) {
      return res.status(500).json({
        success: false,
        message: PASSWORD_RESET_ERRORS.PASSWORD_UPDATE_FAILED
      });
    }

    return handleServerError(res, error, "resetPassword");
  }
};

module.exports = {
  forgotPassword,
  resetPassword: resetPasswordHandler
};
