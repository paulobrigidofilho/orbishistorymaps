///////////////////////////////////////////////////////////////////////
// =================== ORDER VALIDATOR ============================== //
///////////////////////////////////////////////////////////////////////

// This file contains validation functions for order-related operations
// Ensures data integrity before API calls

///////////////////////////////////////////////////////////////////////
// =================== VALIDATION FUNCTIONS ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Validates an order ID format
 * @param {string} orderId - The order ID to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateOrderId(orderId) {
  if (!orderId) {
    return {
      isValid: false,
      message: "Order ID is required",
    };
  }

  if (typeof orderId !== "string") {
    return {
      isValid: false,
      message: "Order ID must be a string",
    };
  }

  // UUID format validation (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId)) {
    return {
      isValid: false,
      message: "Invalid order ID format",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

/**
 * Validates pagination parameters
 * @param {Object} params - Pagination parameters
 * @param {number} params.limit - Number of items per page
 * @param {number} params.offset - Number of items to skip
 * @returns {Object} Validation result with isValid and message
 */
export function validatePagination(params = {}) {
  const { limit, offset } = params;

  if (limit !== undefined) {
    if (typeof limit !== "number" || limit < 1) {
      return {
        isValid: false,
        message: "Limit must be a positive number",
      };
    }
    if (limit > 100) {
      return {
        isValid: false,
        message: "Limit cannot exceed 100",
      };
    }
  }

  if (offset !== undefined) {
    if (typeof offset !== "number" || offset < 0) {
      return {
        isValid: false,
        message: "Offset must be a non-negative number",
      };
    }
  }

  return {
    isValid: true,
    message: "",
  };
}

/**
 * Validates order status filter
 * @param {string} status - The status to validate
 * @param {Object} validStatuses - Valid status options from ORDER_STATUS
 * @returns {Object} Validation result with isValid and message
 */
export function validateStatusFilter(status, validStatuses) {
  if (!status) {
    return {
      isValid: true,
      message: "",
    };
  }

  if (!validStatuses[status]) {
    return {
      isValid: false,
      message: `Invalid status. Valid options: ${Object.keys(validStatuses).join(", ")}`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

// ===== Default export for convenience ===== //
export default {
  validateOrderId,
  validatePagination,
  validateStatusFilter,
};
