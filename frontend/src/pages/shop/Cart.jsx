///////////////////////////////////////////////////////////////////////
// ========================== CART PAGE ============================== //
///////////////////////////////////////////////////////////////////////

// This page displays the user's shopping cart with checkout options

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";
import CartItem from "./components/CartItem";

//  ========== Function imports  ========== //
import fetchCart from "./functions/fetchCart";
import handleUpdateQuantity from "./functions/handleUpdateQuantity";
import handleRemoveItem from "./functions/handleRemoveItem";
import handleClearCart from "./functions/handleClearCart";

//  ========== Helper imports  ========== //
import showMessage from "./helpers/showMessage";
import { calculateCartTotal } from "./helpers/calculateCartTotal";

//  ========== Validator imports  ========== //
import { validateCartForCheckout } from "./validators/cartValidator";

//  ========== Context imports  ========== //
import { AuthContext } from "../common/context/AuthContext";

//  ========== Constants imports  ========== //
import { CART_MESSAGES } from "./constants/cartConstants";

///////////////////////////////////////////////////////////////////////
// =========================== CART PAGE ============================= //
///////////////////////////////////////////////////////////////////////

export default function Cart() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch cart data
  const loadCart = () => fetchCart(setLoading, setError, setCartData);

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => 
    handleUpdateQuantity(cartItemId, newQuantity, setUpdating, loadCart, (text, type) => showMessage(text, type, setMessage));

  // Remove item from cart
  const removeItem = (cartItemId) => 
    handleRemoveItem(cartItemId, setUpdating, loadCart, (text, type) => showMessage(text, type, setMessage));

  // Clear entire cart
  const clearEntireCart = () => 
    handleClearCart(cartData.cart_id, setUpdating, loadCart, (text, type) => showMessage(text, type, setMessage));

  // Proceed to checkout
  const handleCheckout = () => {
    if (!user) {
      showMessage(CART_MESSAGES.LOGIN_REQUIRED, "error", setMessage);
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    const validation = validateCartForCheckout(cartData?.items || []);
    if (!validation.isValid) {
      showMessage(validation.message, "error", setMessage);
      return;
    }

    navigate("/checkout");
  };

  // Calculate totals
  const cartTotal = calculateCartTotal(cartData?.items || []);
  const itemCount = cartData?.items?.length || 0;

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.cartPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.cartPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <h2>Error Loading Cart</h2>
          <p>{error}</p>
          <button onClick={fetchCart} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= EMPTY CART STATE ====================== //
  ///////////////////////////////////////////////////////////////////////

  if (!cartData || itemCount === 0) {
    return (
      <div className={styles.cartPage}>
        <MainNavBar />
        <div className={styles.emptyCartContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#bdc3c7" }}>
            shopping_cart
          </i>
          <h2>Your Cart is Empty</h2>
          <p>Add some items to your cart to get started!</p>
          <button onClick={() => navigate("/shop")} className={styles.shopButton}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.cartPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Cart Container */}
      <div className={styles.cartContainer}>
        {/* Page Header */}
        <div className={styles.cartHeader}>
          <h1>Shopping Cart</h1>
          <p>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.cartContent}>
          {/* Cart Items List */}
          <div className={styles.cartItems}>
            {cartData.items.map((item) => (
              <CartItem
                key={item.cart_item_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                updating={updating}
              />
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearEntireCart}
              disabled={updating}
              className={styles.clearCartButton}
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal ({itemCount} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={updating}
              className={styles.checkoutButton}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/shop")}
              className={styles.continueShoppingButton}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
