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
  if (!file) return { success: true, error: null };

  try {
    avatarSchema.parse({
      size: file.size,
      type: file.type,
      name: file.name
    });
    return { success: true, error: null };
  } catch (error) {
    // Extract the first error message from Zod validation
    const errorMessage = error.errors?.[0]?.message || "Invalid file";
    return { success: false, error: errorMessage };
  }
};
