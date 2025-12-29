///////////////////////////////////////////////////////////////////////
// =================== CALCULATE CART TOTAL HELPER =================== //
///////////////////////////////////////////////////////////////////////

// This helper contains pure functions for cart total calculations

///////////////////////////////////////////////////////////////////////
// ================== CALCULATE CART TOTAL FUNCTION ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Calculates the total price of all items in the cart
 * @param {Array} cartItems - Array of cart items with price and quantity
 * @returns {number} - Total price
 */
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }

  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price_at_addition || 0);
    const quantity = parseInt(item.quantity || 0);
    return total + (price * quantity);
  }, 0);
};

///////////////////////////////////////////////////////////////////////
// ================ CALCULATE ITEM SUBTOTAL FUNCTION ================= //
///////////////////////////////////////////////////////////////////////

/**
 * Calculates the subtotal for a single cart item
 * @param {Object} item - Cart item with price and quantity
 * @returns {number} - Item subtotal
 */
export const calculateItemSubtotal = (item) => {
  const price = parseFloat(item.price_at_addition || 0);
  const quantity = parseInt(item.quantity || 0);
  return price * quantity;
};
