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
import { VALIDATION_ERRORS } from "../constants/authErrorMessages";

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

///////////////////////////////////
// ===== VALIDATION FUNCTIONS ==== //
///////////////////////////////////

// ===== validatePersonalDetails Function ===== //
export const validatePersonalDetails = (data) => {
  const { firstName, lastName, email, password, confirmPassword } = data;

  if (!firstName || !firstName.trim()) {
    return { success: false, error: VALIDATION_ERRORS.FIRST_NAME_REQUIRED };
  }

  if (!lastName || !lastName.trim()) {
    return { success: false, error: VALIDATION_ERRORS.LAST_NAME_REQUIRED };
  }

  if (!email || !email.trim()) {
    return { success: false, error: VALIDATION_ERRORS.EMAIL_REQUIRED };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: VALIDATION_ERRORS.EMAIL_INVALID };
  }

  if (!password || !password.trim()) {
    return { success: false, error: VALIDATION_ERRORS.PASSWORD_REQUIRED };
  }

  // Strong password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    return { success: false, error: VALIDATION_ERRORS.PASSWORD_TOO_WEAK };
  }

  if (password !== confirmPassword) {
    return { success: false, error: VALIDATION_ERRORS.PASSWORD_MISMATCH };
  }

  return { success: true };
};

// ===== validateProfileDetails Function ===== //
export const validateProfileDetails = (data) => {
  const { nickname } = data;

  if (!nickname || !nickname.trim()) {
    return { success: false, error: VALIDATION_ERRORS.NICKNAME_REQUIRED };
  }

  return { success: true };
};
