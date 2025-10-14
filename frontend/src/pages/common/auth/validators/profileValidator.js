///////////////////////////////////
// ===== PROFILE VALIDATOR ===== //
///////////////////////////////////

// This validator handles validation for profile updates
// ensuring data integrity and consistency

import { z } from 'zod';

/**
 * Zod schema for validating profile update details
 */
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string()
    .email({ message: "Invalid email address" }),
  nickname: z.string()
    .min(1, { message: "Nickname is required" })
    .max(30, { message: "Nickname must be less than 30 characters" }),
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  stateName: z.string().optional(),
  zipCode: z.string().optional()
});

/**
 * Validates user is authorized to edit profile
 * @param {string} currentUserId - ID of profile being edited
 * @param {Object} user - Current authenticated user
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateProfileAccess = (currentUserId, user) => {
  if (!user || user.id !== currentUserId) {
    return { 
      success: false, 
      error: "You are not authorized to edit this profile." 
    };
  }
  return { success: true, error: null };
};

/**
 * Validates profile update data using the schema
 * @param {Object} data - The profile update data
 * @returns {Object} - { success: boolean, error: string | null }
 */
export const validateProfileUpdate = (data) => {
  try {
    profileUpdateSchema.parse(data);
    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error.errors?.[0]?.message || "Invalid profile data";
    return { success: false, error: errorMessage };
  }
};
