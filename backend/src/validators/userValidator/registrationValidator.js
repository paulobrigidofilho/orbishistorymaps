///////////////////////////////////////////
// ===== REGISTRATION VALIDATOR ===== //
///////////////////////////////////////////

// This validator handles validation specific to user registration

const Joi = require('joi');
const { nameSchema, emailSchema, passwordSchema } = require('./commonSchemas');

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION SCHEMA ===================== //
///////////////////////////////////////////////////////////////////////

const registrationSchema = Joi.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required'
    }),
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
  address: Joi.string().allow('').optional(),
  addressLine2: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  state: Joi.string().allow('').optional(),
  zipCode: Joi.string().allow('').optional()
});

/**
 * Validates user registration data
 * @param {Object} data - The registration data to validate
 * @returns {Object} - { success: boolean, error: string | null, errors: Array | null }
 */
const validate = (data) => {
  const result = registrationSchema.validate(data, { abortEarly: false });
  if (result.error) {
    const errors = result.error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return { success: false, error: "Invalid personal details", errors };
  }
  return { success: true, error: null, errors: null };
};

module.exports = {
  validate,
  registrationSchema
};
