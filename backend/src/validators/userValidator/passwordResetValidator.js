///////////////////////////////////////////
// ===== PASSWORD RESET VALIDATOR ===== //
///////////////////////////////////////////

// This validator handles validation specific to password reset requests

const Joi = require('joi');
const { emailSchema, passwordSchema } = require('./commonSchemas');

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION SCHEMAS ==================== //
///////////////////////////////////////////////////////////////////////

// ===== Forgot Password Schema ===== //
const forgotPasswordSchema = Joi.object({
  email: emailSchema
});

// ===== Reset Password Schema ===== //
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Reset token is required',
      'any.required': 'Reset token is required'
    }),
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required'
    })
});

///////////////////////////////////////////////////////////////////////
// ========================= VALIDATION FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validates forgot password request data
 * @param {Object} data - The forgot password data to validate
 * @returns {Object} - { success: boolean, error: string | null, errors: Array | null }
 */
const validateForgotPassword = (data) => {
  const { error } = forgotPasswordSchema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return {
      success: false,
      error: errors[0].message,
      errors
    };
  }
  
  return { success: true, error: null, errors: null };
};

/**
 * Validates reset password request data
 * @param {Object} data - The reset password data to validate
 * @returns {Object} - { success: boolean, error: string | null, errors: Array | null }
 */
const validateResetPassword = (data) => {
  const { error } = resetPasswordSchema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return {
      success: false,
      error: errors[0].message,
      errors
    };
  }
  
  return { success: true, error: null, errors: null };
};

module.exports = {
  validateForgotPassword,
  validateResetPassword
};
