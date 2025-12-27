///////////////////////////////////////////////////////////////////////
// =================== HANDLE REMOVE ITEM ============================ //
///////////////////////////////////////////////////////////////////////

// This function handles removing items from cart

//  ========== Function imports  ========== //
import removeCartItem from "./cartService/removeCartItem";

///////////////////////////////////////////////////////////////////////
// ================== HANDLE REMOVE ITEM FUNCTION ==================== //
///////////////////////////////////////////////////////////////////////

/**
 * Remove item from cart with confirmation
 * @param {string} cartItemId - Cart item UUID
 * @param {Function} setUpdating - Loading state setter
 * @param {Function} fetchCart - Function to refresh cart
 * @param {Function} showMessage - Message display function
 * @returns {Promise<void>}
 */
export default async function handleRemoveItem(cartItemId, setUpdating, fetchCart, showMessage) {
  if (!window.confirm("Remove this item from cart?")) return;

  try {
    setUpdating(true);
    await removeCartItem(cartItemId);
    await fetchCart(); // Refresh cart
    window.dispatchEvent(new Event("cartUpdated"));
    showMessage("Item removed from cart", "success");
  } catch (err) {
    console.error("Error removing item:", err);
    showMessage(err.message || "Failed to remove item", "error");
  } finally {
    setUpdating(false);
  }
}
