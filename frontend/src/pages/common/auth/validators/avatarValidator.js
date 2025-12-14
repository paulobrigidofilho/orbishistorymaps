//////////////////////////////////
// ===== AVATAR VALIDATOR ===== //
//////////////////////////////////

// This validator handles validation for avatar uploads
// ensuring correct file size and type requirements

/**
 * Zod schema for validating avatar files
 * - Size must be less than 1MB
 * - Type must be one of: jpeg, jpg, png, gif
 */

// ===== Module Imports ===== //
import { z } from 'zod';
import { AVATAR_ERRORS } from "../constants/authErrorMessages";

// ===== Avatar Schema ===== //
export const avatarSchema = z.object({
  size: z.number()
    .max(1024 * 1024, { message: "File must be less than 1MB." }),
  type: z.string()
    .refine(
      (type) => /image\/(jpeg|jpg|png|gif)/.test(type), 
      { message: "Invalid file type. Only .jpeg, .jpg, .png and .gif files are allowed!" }
    ),
  name: z.string()
    .refine(
      (name) => /\.(jpeg|jpg|png|gif)$/i.test(name),
      { message: "Invalid file extension. Only .jpeg, .jpg, .png and .gif files are allowed!" }
    )
});

/**
 * Validates an avatar file using the avatar schema
 * @param {File} file - The file object to validate
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateAvatar = (file) => {
  if (!file) {
    return { success: false, error: AVATAR_ERRORS.NO_FILE_SELECTED };
  }
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: AVATAR_ERRORS.FILE_TOO_LARGE };
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    return { success: false, error: AVATAR_ERRORS.INVALID_FILE_TYPE };
  }

  return { success: true };
};
