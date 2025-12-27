///////////////////////////////////////////////////////////////////////
// =================== CALCULATE CART TOTAL FUNCTION ================= //
///////////////////////////////////////////////////////////////////////

// This function calculates the total price of items in the cart

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
