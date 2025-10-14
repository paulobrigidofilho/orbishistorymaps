////////////////////////////////////////
// ===== REGISTRATION VALIDATOR ===== //
////////////////////////////////////////

// This validator handles validation for user registration fields
// ensuring data integrity and security requirements

import { z } from 'zod';

/**
 * Zod schema for validating personal details
 */
export const personalDetailsSchema = z.object({
  firstName: z.string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
});

/**
 * Zod schema for validating profile details
 */
export const profileDetailsSchema = z.object({
  nickname: z.string()
    .min(1, { message: "Nickname is required" })
    .max(30, { message: "Nickname must be less than 30 characters" })
});

/**
 * Zod schema for validating address details
 */
export const addressDetailsSchema = z.object({
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateName: z.string().optional(),
  zipCode: z.string().optional()
});

/**
 * Validates password and confirm password match
 * @param {Object} data - Object containing password and confirmPassword
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validatePasswordMatch = (data) => {
  if (data.password !== data.confirmPassword) {
    return { 
      success: false, 
      error: "Passwords don't match" 
    };
  }
  return { success: true, error: null };
};

/**
 * Validates personal details using the schema
 * @param {Object} data - The personal details data
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validatePersonalDetails = (data) => {
  try {
    personalDetailsSchema.parse(data);
    const passwordMatch = validatePasswordMatch(data);
    if (!passwordMatch.success) {
      return passwordMatch;
    }
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid personal details";
    return { success: false, error: errorMessage };
  }
};

/**
 * Validates profile details using the schema
 * @param {Object} data - The profile details data
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateProfileDetails = (data) => {
  try {
    profileDetailsSchema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid profile details";
    return { success: false, error: errorMessage };
  }
};
