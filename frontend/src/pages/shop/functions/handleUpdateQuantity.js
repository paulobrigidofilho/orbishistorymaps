///////////////////////////////////////////////////////////////////////
// ================== HANDLE UPDATE QUANTITY ========================= //
///////////////////////////////////////////////////////////////////////

// This function handles cart item quantity updates

//  ========== Function imports  ========== //
import updateCartItem from "./cartService/updateCartItem";

///////////////////////////////////////////////////////////////////////
// ================= HANDLE UPDATE QUANTITY FUNCTION ================= //
///////////////////////////////////////////////////////////////////////

/**
 * Update cart item quantity
 * @param {string} cartItemId - Cart item UUID
 * @param {number} newQuantity - New quantity value
 * @param {Function} setUpdating - Loading state setter
 * @param {Function} fetchCart - Function to refresh cart
 * @param {Function} showMessage - Message display function
 * @returns {Promise<void>}
 */
export default async function handleUpdateQuantity(cartItemId, newQuantity, setUpdating, fetchCart, showMessage) {
  try {
    setUpdating(true);
    await updateCartItem(cartItemId, newQuantity);
    await fetchCart(); // Refresh cart
    window.dispatchEvent(new Event("cartUpdated"));
    showMessage("Cart updated", "success");
  } catch (err) {
    console.error("Error updating cart:", err);
    showMessage(err.message || "Failed to update cart", "error");
  } finally {
    setUpdating(false);
  }
}
