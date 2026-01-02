///////////////////////////////////////////////////////////////////////
// ================ FREIGHT VALIDATOR ============================== //
///////////////////////////////////////////////////////////////////////

// This validator ensures freight configuration values are valid

/**
 * Validation error messages
 */
export const FREIGHT_VALIDATION_ERRORS = {
  LOCAL_REQUIRED: "Local freight cost is required",
  LOCAL_POSITIVE: "Local freight cost must be a positive number",
  INVALID_NUMBER: "All freight costs must be valid numbers",
  THRESHOLD_POSITIVE: "Threshold values must be positive numbers",
  THRESHOLD_LOCAL_LESS: "Local threshold must be less than or equal to national threshold",
  THRESHOLD_NATIONAL_LESS: "National threshold must be less than or equal to international threshold",
};

/**
 * Validate a single numeric field
 * @param {any} value - The value to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} Validation result { valid, error }
 */
const validateNumericField = (value, required = false) => {
  // Check if empty
  if (value === "" || value === null || value === undefined) {
    if (required) {
      return { valid: false, error: "This field is required" };
    }
    return { valid: true, error: null };
  }

  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { valid: false, error: "Must be a valid number" };
  }
  
  if (num < 0) {
    return { valid: false, error: "Must be a positive number" };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate entire freight configuration
 * @param {Object} data - The freight data to validate
 * @returns {Object} Validation result { valid, errors }
 */
export const validateFreightConfig = (data) => {
  const errors = {};
  let valid = true;

  // Validate local (required)
  const localValidation = validateNumericField(data.local, true);
  if (!localValidation.valid) {
    errors.local = FREIGHT_VALIDATION_ERRORS.LOCAL_REQUIRED;
    valid = false;
  } else if (parseFloat(data.local) <= 0) {
    errors.local = FREIGHT_VALIDATION_ERRORS.LOCAL_POSITIVE;
    valid = false;
  }

  // Validate zone costs (optional but must be valid if provided)
  const zoneCostFields = [
    "north_island",
    "south_island",
    "intl_asia",
    "intl_north_america",
    "intl_europe",
    "intl_africa",
    "intl_latin_america",
  ];

  zoneCostFields.forEach((field) => {
    if (data[field] !== "" && data[field] != null) {
      const validation = validateNumericField(data[field]);
      if (!validation.valid) {
        errors[field] = validation.error;
        valid = false;
      }
    }
  });

  // Validate thresholds (optional but must be valid if provided)
  if (data.is_free_freight_enabled) {
    const thresholdFields = ["threshold_local", "threshold_national", "threshold_international"];
    
    thresholdFields.forEach((field) => {
      if (data[field] !== "" && data[field] != null) {
        const validation = validateNumericField(data[field]);
        if (!validation.valid) {
          errors[field] = validation.error;
          valid = false;
        } else if (parseFloat(data[field]) < 0) {
          errors[field] = FREIGHT_VALIDATION_ERRORS.THRESHOLD_POSITIVE;
          valid = false;
        }
      }
    });

    // Validate threshold order: local <= national <= international
    const thresholdLocal = parseFloat(data.threshold_local) || 200;
    const thresholdNational = parseFloat(data.threshold_national) || 300;
    const thresholdInternational = parseFloat(data.threshold_international) || 500;

    if (thresholdLocal > thresholdNational) {
      errors.threshold_local = FREIGHT_VALIDATION_ERRORS.THRESHOLD_LOCAL_LESS;
      valid = false;
    }

    if (thresholdNational > thresholdInternational) {
      errors.threshold_national = FREIGHT_VALIDATION_ERRORS.THRESHOLD_NATIONAL_LESS;
      valid = false;
    }
  }

  return { valid, errors };
};

/**
 * Quick validation check for local field only
 * @param {any} value - The local value to validate
 * @returns {boolean} Whether the local value is valid
 */
export const isValidLocal = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

export default validateFreightConfig;
