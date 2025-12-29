///////////////////////////////////////////////////////////////////////
// ====================== FETCH CART HELPER ========================== //
///////////////////////////////////////////////////////////////////////

// This helper function fetches and updates cart data

//  ========== Function imports  ========== //
import getCart from "./cartService/getCart";

///////////////////////////////////////////////////////////////////////
// ====================== FETCH CART FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetch cart data and update state
 * @param {Function} setLoading - Loading state setter
 * @param {Function} setError - Error state setter
 * @param {Function} setCartData - Cart data state setter
 * @returns {Promise<Object>} Cart data
 */
export default async function fetchCart(setLoading, setError, setCartData) {
  try {
    setLoading(true);
    setError(null);
    const data = await getCart();
    setCartData(data.data);
    return data.data;
  } catch (err) {
    console.error("Error loading cart:", err);
    setError(err.message || "Failed to load cart");
    throw err;
  } finally {
    setLoading(false);
  }
}
