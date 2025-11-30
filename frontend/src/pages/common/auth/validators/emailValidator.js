/////////////////////////////////
// ===== EMAIL VALIDATOR ===== //
/////////////////////////////////

// This validator handles validation for email addresses
// ensuring proper format and domain requirements

// ===== Module Imports ===== //

import { z } from "zod";

/**
 * Zod schema for validating email addresses
 */
export const emailSchema = z
  .string()
  .email({ message: "Invalid email address" })
  .refine((email) => email.trim().length > 0, {
    message: "Email is required",
  });

// ===== validateEmail Function ===== //

export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage =
      error.errors?.[0]?.message ||
      "Invalid email address format. Please enter a valid email.";
    return { success: false, error: errorMessage };
  }
};
