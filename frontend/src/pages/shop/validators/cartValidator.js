///////////////////////////////////////////////////////////////////////
// ======================= CART VALIDATOR ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains validation functions for cart operations

/**
 * Validates quantity input
 * @param {number} quantity - Quantity to validate
 * @param {number} maxStock - Maximum available stock
 * @returns {Object} - Validation result with isValid and message
 */
export const validateQuantity = (quantity, maxStock) => {
  const qty = parseInt(quantity);

  if (isNaN(qty) || qty < 1) {
    return {
      isValid: false,
      message: "Quantity must be at least 1",
    };
  }

  if (qty > maxStock) {
    return {
      isValid: false,
      message: `Only ${maxStock} items available in stock`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validates cart before checkout
 * @param {Array} cartItems - Array of cart items
 * @returns {Object} - Validation result
 */
export const validateCartForCheckout = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: false,
      message: "Your cart is empty",
    };
  }

  // Check if any items are out of stock
  const outOfStockItems = cartItems.filter(
    (item) => item.quantity > item.quantity_available
  );

  if (outOfStockItems.length > 0) {
    return {
      isValid: false,
      message: "Some items in your cart are out of stock",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
