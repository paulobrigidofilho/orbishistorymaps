////////////////////////////////
// ===== LOGIN VALIDATOR ===== //
////////////////////////////////

// This validator handles validation specific to user login

const Joi = require('joi');
const { emailSchema } = require('./commonSchemas');

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION SCHEMA ===================== //
///////////////////////////////////////////////////////////////////////

const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

/**
 * Validates user login data
 * @param {Object} data - The login data to validate
 * @returns {Object} - { success: boolean, error: string | null, errors: Array | null }
 */
const validate = (data) => {
  const result = loginSchema.validate(data, { abortEarly: false });
  if (result.error) {
    const errors = result.error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return { success: false, error: "Invalid login credentials", errors };
  }
  return { success: true, error: null, errors: null };
};

module.exports = {
  validate,
  loginSchema
};
