////////////////////////////////////
// ===== PASSWORD VALIDATOR ===== //
////////////////////////////////////

// This validator handles validation for passwords
// ensuring security requirements and password matching

/**
 * Validates password and confirm password match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - { success: boolean, error: string | null }
 */

// ===== Module Imports ===== //
import { z } from "zod";

// ===== Password Schema ===== //
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

// ===== validatePasswordMatch Function ===== //

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords don't match",
    };
  }
  return { success: true, error: null };
};

// ===== validatePassword Function ===== //

export const validatePassword = (password, useStrict = true) => {
  try {
    if (useStrict) {
      passwordSchema.parse(password);
    } else {
      // Use less strict validation if needed
      z.string().min(6).parse(password);
    }
    return { success: true, error: null };
  } catch (error) {
    // Robust extraction of messages from Zod errors (supports .errors and .issues)
    const issues = error?.errors || error?.issues || [];
    const messages =
      Array.isArray(issues) && issues.length
        ? issues.map((i) => i?.message || String(i)).filter(Boolean)
        : [];

    const errorMessage = messages.length
      ? messages.join("; ")
      : error?.message || "Invalid password";

    return { success: false, error: errorMessage };
  }
};

// ===== validatePasswordWithConfirmation Function ===== //

export const validatePasswordWithConfirmation = (
  password,
  confirmPassword,
  useStrict = true
) => {
  // First validate password strength
  const passwordValidation = validatePassword(password, useStrict);
  if (!passwordValidation.success) {
    return passwordValidation;
  }

  // Then validate password match
  return validatePasswordMatch(password, confirmPassword);
};
