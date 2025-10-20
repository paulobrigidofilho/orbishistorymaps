///////////////////////////////////
// ===== COMMON SCHEMAS ===== //
///////////////////////////////////

// This file contains reusable validation schemas
// that can be imported by other user validator files

const Joi = require('joi');

/**
 * Creates a schema for validating names with customizable label
 * @param {string} label - The field label (e.g., "First name", "Last name")
 * @returns {Joi.StringSchema} - The Joi schema for name validation
 */
const nameSchema = (label = 'Name') => Joi.string()
  .trim()
  .min(1)
  .max(50)
  .required()
  .messages({
    'string.empty': `${label} is required`,
    'string.min': `${label} must be at least {#limit} character`,
    'string.max': `${label} must be less than {#limit} characters`
  });

/**
 * Schema for email validation
 */
const emailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: false } }) // Disable TLD validation
  .required()
  .messages({
    'string.email': 'Invalid email address',
    'string.empty': 'Email is required'
  });

/**
 * Schema for password validation
 */
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/[A-Z]/)
  .pattern(/[a-z]/)
  .pattern(/[0-9]/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.pattern.base': 'Password must include uppercase, lowercase, and numbers',
    'string.empty': 'Password is required'
  });

/**
 * Schema for address validation
 */
const addressSchema = Joi.string().allow('').optional();

module.exports = {
  nameSchema,
  emailSchema,
  passwordSchema,
  addressSchema
};
