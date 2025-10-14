////////////////////////////////
// ===== NAME VALIDATOR ===== //
////////////////////////////////

// This validator handles validation for name-related fields
// ensuring proper formatting and length requirements

import { z } from 'zod';

/**
 * Zod schema for validating names (first name, last name)
 */
export const nameSchema = z.string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be less than 50 characters" })
  .refine(name => /^[^\d]+$/.test(name), {
    message: "Name should not contain numbers"
  });

/**
 * Zod schema for validating nicknames
 */
export const nicknameSchema = z.string()
  .min(1, { message: "Nickname is required" })
  .max(30, { message: "Nickname must be less than 30 characters" });

/**
 * Validates a first name using the name schema
 * @param {string} firstName - The first name to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateFirstName = (firstName) => {
  try {
    nameSchema.parse(firstName);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid first name";
    return { success: false, error: errorMessage };
  }
};

/**
 * Validates a last name using the name schema
 * @param {string} lastName - The last name to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateLastName = (lastName) => {
  try {
    nameSchema.parse(lastName);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid last name";
    return { success: false, error: errorMessage };
  }
};

/**
 * Validates a nickname using the nickname schema
 * @param {string} nickname - The nickname to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateNickname = (nickname) => {
  try {
    nicknameSchema.parse(nickname);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid nickname";
    return { success: false, error: errorMessage };
  }
};
