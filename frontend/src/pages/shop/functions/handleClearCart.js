///////////////////////////////////////////////////////////////////////
// =================== HANDLE CLEAR CART ============================= //
///////////////////////////////////////////////////////////////////////

// This function handles clearing all items from cart
// NOTE: Confirmation is now handled via AlertModal in the component

//  ========== Function imports  ========== //
import clearCart from "./cartService/clearCart";

///////////////////////////////////////////////////////////////////////
// ================== HANDLE CLEAR CART FUNCTION ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * Clear all items from cart (after confirmation via AlertModal)
 * @param {string} cartId - Cart UUID
 * @param {Function} setUpdating - Loading state setter
 * @param {Function} fetchCart - Function to refresh cart
 * @param {Function} showMessage - Message display function
 * @returns {Promise<void>}
 */
export default async function handleClearCart(cartId, setUpdating, fetchCart, showMessage) {
  try {
    setUpdating(true);
    await clearCart(cartId);
    await fetchCart(); // Refresh cart
    window.dispatchEvent(new Event("cartUpdated"));
    showMessage("Cart cleared", "success");
  } catch (err) {
    console.error("Error clearing cart:", err);
    showMessage(err.message || "Failed to clear cart", "error");
  } finally {
    setUpdating(false);
  }
}
