///////////////////////////////////////////////////////////////////////
// =================== HANDLE ADD TO CART ============================ //
///////////////////////////////////////////////////////////////////////

// This function handles adding products to cart

//  ========== Function imports  ========== //
import addToCart from "./cartService/addToCart";

///////////////////////////////////////////////////////////////////////
// =================== HANDLE ADD TO CART FUNCTION =================== //
///////////////////////////////////////////////////////////////////////

/**
 * Handle add to cart with state updates
 * @param {string} productId - Product UUID
 * @param {number} quantity - Quantity to add
 * @param {Function} setAddingToCart - Loading state setter
 * @param {Function} setCartMessage - Message state setter
 * @returns {Promise<void>}
 */
export default async function handleAddToCart(productId, quantity, setAddingToCart, setCartMessage) {
  try {
    setAddingToCart(true);
    setCartMessage(null);

    await addToCart(productId, quantity);

    // Dispatch custom event to update cart badge
    window.dispatchEvent(new Event("cartUpdated"));

    setCartMessage({ type: "success", text: "Added to cart successfully!" });
    setTimeout(() => setCartMessage(null), 3000);
  } catch (err) {
    console.error("Error adding to cart:", err);
    setCartMessage({
      type: "error",
      text: err.message || "Failed to add to cart",
    });
  } finally {
    setAddingToCart(false);
  }
}
