////////////////////////////////////////
// ===== REGISTRATION VALIDATOR ===== //
////////////////////////////////////////

// This validator handles validation for user registration fields
// using specialized validators for different data types

import { z } from "zod";
import { validateFirstName, validateLastName } from "./nameValidator";
import { validateEmail } from "./emailValidator";
import { validatePasswordWithConfirmation } from "./passwordValidator";

/**
 * Zod schema for validating profile details
 */
export const profileDetailsSchema = z.object({
  nickname: z
    .string()
    .min(1, { message: "Nickname is required" })
    .max(30, { message: "Nickname must be less than 30 characters" }),
});

/**
 * Zod schema for validating address details
 */
export const addressDetailsSchema = z.object({
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateName: z.string().optional(),
  zipCode: z.string().optional(),
});

/**
 * Validates personal details using specialized validators
 * @param {Object} data - The personal details data
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validatePersonalDetails = (data) => {
  // Validate first name
  const firstNameValidation = validateFirstName(data.firstName);
  if (!firstNameValidation.success) {
    return firstNameValidation;
  }

  // Validate last name
  const lastNameValidation = validateLastName(data.lastName);
  if (!lastNameValidation.success) {
    return lastNameValidation;
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.success) {
    return emailValidation;
  }

  // Validate password and confirmation
  const passwordValidation = validatePasswordWithConfirmation(
    data.password,
    data.confirmPassword,
    true // Use strict validation
  );
  if (!passwordValidation.success) {
    return passwordValidation;
  }

  return { success: true, error: null };
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
    const errorMessage =
      error.errors?.[0]?.message || "Invalid profile details";
    return { success: false, error: errorMessage };
  }
};
