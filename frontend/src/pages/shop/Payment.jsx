///////////////////////////////////////////////////////////////////////
// ========================== PAYMENT PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page handles payment method selection and order processing

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Payment.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";

//  ========== Service imports  ========== //
import { createOrder } from "./services/orderService";
import { clearCart } from "./services/cartService";

//  ========== Validator imports  ========== //
import { validatePaymentMethod } from "./validators/checkoutValidator";

//  ========== Context imports  ========== //
import { AuthContext } from "../common/context/AuthContext";

//  ========== Constants imports  ========== //
import { PAYMENT_METHODS } from "./constants/cartConstants";

///////////////////////////////////////////////////////////////////////
// ========================= PAYMENT PAGE ============================ //
///////////////////////////////////////////////////////////////////////

export default function Payment() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [checkoutData, setCheckoutData] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Load checkout data from session storage
  useEffect(() => {
    if (!user) {
      showMessage("Please login to complete payment", "error");
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    // Get data from session storage
    const address = sessionStorage.getItem("checkoutAddress");
    const cart = sessionStorage.getItem("checkoutCart");

    if (!address || !cart) {
      showMessage("Checkout data not found. Please start checkout again.", "error");
      setTimeout(() => navigate("/cart"), 2000);
      return;
    }

    try {
      const addressData = JSON.parse(address);
      const cartData = JSON.parse(cart);

      const cartTotal = cartData.items.reduce(
        (total, item) => total + item.price_at_addition * item.quantity,
        0
      );
      const shippingCost = cartTotal > 100 ? 0 : 10;
      const total = cartTotal + shippingCost;

      setCheckoutData({
        address: addressData,
        cart: cartData,
        subtotal: cartTotal,
        shipping: shippingCost,
        total: total,
      });

      setOrderTotal(total);
      setLoading(false);
    } catch (err) {
      console.error("Error loading checkout data:", err);
      showMessage("Invalid checkout data", "error");
      setTimeout(() => navigate("/cart"), 2000);
    }
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Handle payment method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (error) setError(null);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    // Validate payment method
    const validation = validatePaymentMethod(selectedMethod);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        shipping_address: checkoutData.address,
        payment_method: selectedMethod,
        order_items: checkoutData.cart.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_addition,
        })),
        subtotal: checkoutData.subtotal,
        shipping_cost: checkoutData.shipping,
        total_amount: checkoutData.total,
      };

      // Create order
      const response = await createOrder(orderData);

      if (response.success) {
        // Clear cart after successful order
        await clearCart(checkoutData.cart.cart_id);

        // Clear session storage
        sessionStorage.removeItem("checkoutAddress");
        sessionStorage.removeItem("checkoutCart");

        // Store order ID and navigate to confirmation
        sessionStorage.setItem("lastOrderId", response.data.order_id);
        navigate("/order-confirmation");
      }
    } catch (err) {
      console.error("Error processing order:", err);
      showMessage(err.message || "Failed to process order. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  // Show message helper
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.paymentPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading payment...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.paymentPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Payment Container */}
      <div className={styles.paymentContainer}>
        <h1>Payment</h1>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.paymentContent}>
          {/* Payment Method Section */}
          <div className={styles.paymentSection}>
            <h2>Select Payment Method</h2>

            <div className={styles.paymentMethods}>
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.value}
                  className={`${styles.paymentMethod} ${
                    selectedMethod === method.value ? styles.selected : ""
                  }`}
                  onClick={() => handleMethodSelect(method.value)}
                >
                  <div className={styles.methodRadio}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={selectedMethod === method.value}
                      onChange={() => handleMethodSelect(method.value)}
                    />
                  </div>
                  <div className={styles.methodInfo}>
                    <span className={styles.methodLabel}>{method.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Demo Note */}
            <div className={styles.demoNote}>
              <p>
                <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be
                processed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className={styles.paymentActions}>
              <button
                onClick={() => navigate("/checkout")}
                disabled={processing}
                className={styles.backButton}
              >
                Back to Checkout
              </button>
              <button
                onClick={handleSubmitOrder}
                disabled={processing || !selectedMethod}
                className={styles.placeOrderButton}
              >
                {processing ? "Processing..." : `Place Order - $${orderTotal.toFixed(2)}`}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>

            <div className={styles.summarySection}>
              <h3>Shipping Address</h3>
              <div className={styles.addressDisplay}>
                <p>{checkoutData.address.street_address}</p>
                <p>
                  {checkoutData.address.city}, {checkoutData.address.state}{" "}
                  {checkoutData.address.postal_code}
                </p>
                <p>{checkoutData.address.country}</p>
              </div>
            </div>

            <div className={styles.summarySection}>
              <h3>Order Items ({checkoutData.cart.items.length})</h3>
              <div className={styles.itemsList}>
                {checkoutData.cart.items.map((item) => (
                  <div key={item.cart_item_id} className={styles.summaryItem}>
                    <div>
                      <p className={styles.itemName}>{item.product_name}</p>
                      <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                    </div>
                    <p className={styles.itemPrice}>
                      ${(item.price_at_addition * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${checkoutData.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {checkoutData.shipping === 0 ? "FREE" : `$${checkoutData.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>${checkoutData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
