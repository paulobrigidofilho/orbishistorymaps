///////////////////////////////////
// ===== PASSWORD VALIDATOR ===== //
///////////////////////////////////

// This validator handles validation for passwords
// ensuring security requirements and password matching

import { z } from 'zod';

/**
 * Zod schema for validating passwords with configurable strength
 */
export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });
  // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

/**
 * Validates password and confirm password match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { 
      success: false, 
      error: "Passwords don't match" 
    };
  }
  return { success: true, error: null };
};

/**
 * Validates a password using the password schema
 * @param {string} password - The password to validate
 * @param {boolean} useStrict - Whether to use strict validation (default: true)
 * @returns {Object} - { success: boolean, error: string | null }
 */
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
    const errorMessage = error.errors?.[0]?.message || "Invalid password";
    return { success: false, error: errorMessage };
  }
};

/**
 * Comprehensive password validation including matching
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @param {boolean} useStrict - Whether to use strict validation
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validatePasswordWithConfirmation = (password, confirmPassword, useStrict = true) => {
  // First validate password strength
  const passwordValidation = validatePassword(password, useStrict);
  if (!passwordValidation.success) {
    return passwordValidation;
  }
  
  // Then validate password match
  return validatePasswordMatch(password, confirmPassword);
};
