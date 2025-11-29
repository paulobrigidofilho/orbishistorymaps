////////////////////////////////////////
// ===== REGISTRATION VALIDATOR ===== //
////////////////////////////////////////

// This validator handles validation for user registration fields
// using specialized validators for different data types

// ===== Module Imports ===== //
import { z } from "zod";
import { validateFirstName, validateLastName } from "./nameValidator";
import { validateEmail } from "./emailValidator";
import { validatePasswordWithConfirmation } from "./passwordValidator";

// ===== Schema Definitions ===== //

// ===== Profile Details Schema ===== //
export const profileDetailsSchema = z.object({
  nickname: z
    .string()
    .min(1, { message: "Nickname is required" })
    .max(30, { message: "Nickname must be less than 30 characters" }),
});

// ===== Address Details Schema ===== //
export const addressDetailsSchema = z.object({
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateName: z.string().optional(),
  zipCode: z.string().optional(),
});

// ===== Validation Functions ===== //

// ===== validatePersonalDetails Function ===== //
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

// ===== validateProfileDetails Function ===== //
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
