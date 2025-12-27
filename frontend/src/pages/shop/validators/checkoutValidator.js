///////////////////////////////////////////////////////////////////////
// ===================== CHECKOUT VALIDATOR ========================== //
///////////////////////////////////////////////////////////////////////

// This file contains validation functions for checkout process

/**
 * Validates shipping address fields
 * @param {Object} address - Address object to validate
 * @returns {Object} - Validation result with isValid, errors object
 */
export const validateShippingAddress = (address) => {
  const errors = {};

  // Street address validation
  if (!address.street_address || address.street_address.trim().length < 5) {
    errors.street_address = "Street address must be at least 5 characters";
  }

  // City validation
  if (!address.city || address.city.trim().length < 2) {
    errors.city = "City is required";
  }

  // State validation
  if (!address.state || address.state.trim().length < 2) {
    errors.state = "State is required";
  }

  // Postal code validation
  if (!address.postal_code || !/^\d{4,10}$/.test(address.postal_code)) {
    errors.postal_code = "Valid postal code is required";
  }

  // Country validation
  if (!address.country || address.country.trim().length < 2) {
    errors.country = "Country is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates payment method selection
 * @param {string} paymentMethod - Selected payment method
 * @returns {Object} - Validation result
 */
export const validatePaymentMethod = (paymentMethod) => {
  const validMethods = ["credit_card", "debit_card", "paypal", "bank_transfer"];

  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return {
      isValid: false,
      message: "Please select a valid payment method",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
