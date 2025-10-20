///////////////////////////////////
// ===== PROFILE VALIDATOR ===== //
///////////////////////////////////

// This validator handles validation for profile updates

const Joi = require('joi');
const { nameSchema, emailSchema } = require('./commonSchemas');

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION SCHEMA ===================== //
///////////////////////////////////////////////////////////////////////

const profileUpdateSchema = Joi.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  email: emailSchema,
  nickname: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Nickname is required',
      'string.min': 'Nickname must be at least {#limit} character',
      'string.max': 'Nickname must be less than {#limit} characters'
    }),
  
  // Optional fields
  avatar: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  addressLine2: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  zipCode: Joi.string().allow('').optional()
});

/**
 * Validates profile update data
 * @param {Object} data - The profile update data to validate
 * @returns {Object} - { success: boolean, error: string | null, errors: Array | null }
 */
const validate = (data) => {
  const result = profileUpdateSchema.validate(data, { abortEarly: false });
  if (result.error) {
    const errors = result.error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return { success: false, error: "Invalid profile data", errors };
  }
  return { success: true, error: null, errors: null };
};

module.exports = {
  validate,
  profileUpdateSchema
};
