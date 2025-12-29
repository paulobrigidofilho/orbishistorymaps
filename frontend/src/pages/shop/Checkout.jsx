///////////////////////////////////////////////////////////////////////
// ========================== CHECKOUT PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// This page handles the checkout process with address and order summary

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";

//  ========== Function imports  ========== //
import fetchCart from "./functions/fetchCart";

//  ========== Helper imports  ========== //
import showMessage from "./helpers/showMessage";
import { calculateCartTotal } from "./helpers/calculateCartTotal";

//  ========== Validator imports  ========== //
import { validateShippingAddress } from "./validators/checkoutValidator";

//  ========== Context imports  ========== //
import { AuthContext } from "../common/context/AuthContext";

///////////////////////////////////////////////////////////////////////
// ========================= CHECKOUT PAGE =========================== //
///////////////////////////////////////////////////////////////////////

export default function Checkout() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  // Address selection state
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Check authentication and load cart
  useEffect(() => {
    if (!user) {
      showMessage("Please login to checkout", "error", setMessage);
      setTimeout(() => navigate("/register"), 2000);
      return;
    }

    loadCart();
    loadSavedAddress();
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch cart data
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart(setLoading, () => {}, setCartData);
      if (!data || data.items.length === 0) {
        showMessage("Your cart is empty", "error", setMessage);
        setTimeout(() => navigate("/cart"), 2000);
        return;
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      showMessage("Failed to load cart", "error", setMessage);
    }
  };

  // Load saved address from user profile
  const loadSavedAddress = () => {
    if (user?.address && user?.city && user?.state && user?.zipCode) {
      setShippingAddress({
        street_address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postal_code: user.zipCode || "",
        country: "New Zealand", // Default country
      });
      setHasSavedAddress(true);
      setUseSavedAddress(true);
    } else {
      setHasSavedAddress(false);
      setUseSavedAddress(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle select different address
  const handleSelectDifferentAddress = () => {
    setUseSavedAddress(false);
    // Clear the form for new address
    setShippingAddress({
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    });
  };

  // Handle use saved address
  const handleUseSavedAddress = () => {
    setUseSavedAddress(true);
    loadSavedAddress();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate address
    const validation = validateShippingAddress(shippingAddress);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showMessage("Please fix the errors in the form", "error");
      return;
    }

    // Store shipping address in session storage for payment page
    sessionStorage.setItem("checkoutAddress", JSON.stringify(shippingAddress));
    sessionStorage.setItem("checkoutCart", JSON.stringify(cartData));

    // Navigate to payment page
    navigate("/payment");
  };

  // Calculate totals
  const cartTotal = calculateCartTotal(cartData?.items || []);
  const shippingCost = cartTotal > 100 ? 0 : 10; // Free shipping over $100
  const orderTotal = cartTotal + shippingCost;

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.checkoutPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.checkoutPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Checkout Container */}
      <div className={styles.checkoutContainer}>
        <h1>Checkout</h1>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.checkoutContent}>
          {/* Shipping Address Form */}
          <div className={styles.shippingSection}>
            <h2>Shipping Address</h2>

            {/* Saved Address Display */}
            {hasSavedAddress && useSavedAddress && (
              <div className={styles.savedAddressDisplay}>
                <div className={styles.addressBox}>
                  <div className={styles.addressContent}>
                    <p>
                      <strong>
                        {user.firstName} {user.lastName}
                      </strong>
                    </p>
                    <p>{user.address}</p>
                    {user.addressLine2 && <p>{user.addressLine2}</p>}
                    <p>
                      {user.city}, {user.state} {user.zipCode}
                    </p>
                    <p>New Zealand</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectDifferentAddress}
                    className={styles.changAddressButton}
                  >
                    Select different address
                  </button>
                </div>
              </div>
            )}

            {/* Grayed Out Saved Address When Editing */}
            {hasSavedAddress && !useSavedAddress && (
              <div className={styles.savedAddressGrayedOut}>
                <div className={styles.addressBox}>
                  <div className={styles.addressContent}>
                    <p>
                      <strong>
                        {user.firstName} {user.lastName}
                      </strong>
                    </p>
                    <p>{user.address}</p>
                    {user.addressLine2 && <p>{user.addressLine2}</p>}
                    <p>
                      {user.city}, {user.state} {user.zipCode}
                    </p>
                    <p>New Zealand</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseSavedAddress}
                    className={styles.useSavedButton}
                  >
                    Use this address
                  </button>
                </div>
              </div>
            )}

            {/* Address Form - Show when no saved address OR when selecting different address */}
            {(!hasSavedAddress || !useSavedAddress) && (
              <form onSubmit={handleSubmit} className={styles.addressForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="street_address">Street Address *</label>
                  <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={shippingAddress.street_address}
                    onChange={handleInputChange}
                    className={errors.street_address ? styles.error : ""}
                  />
                  {errors.street_address && (
                    <span className={styles.errorMessage}>
                      {errors.street_address}
                    </span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className={errors.city ? styles.error : ""}
                    />
                    {errors.city && (
                      <span className={styles.errorMessage}>{errors.city}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className={errors.state ? styles.error : ""}
                    />
                    {errors.state && (
                      <span className={styles.errorMessage}>
                        {errors.state}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="postal_code">Postal Code *</label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={handleInputChange}
                      className={errors.postal_code ? styles.error : ""}
                    />
                    {errors.postal_code && (
                      <span className={styles.errorMessage}>
                        {errors.postal_code}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className={errors.country ? styles.error : ""}
                    />
                    {errors.country && (
                      <span className={styles.errorMessage}>
                        {errors.country}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className={styles.backButton}
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.continueButton}
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* Continue button when using saved address - only if form is hidden */}
            {hasSavedAddress && useSavedAddress && (
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className={styles.backButton}
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={styles.continueButton}
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>

            <div className={styles.summaryItems}>
              {cartData?.items?.map((item) => (
                <div key={item.cart_item_id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product_name}</span>
                    <span className={styles.itemQuantity}>
                      x{item.quantity}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.price_at_addition * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {cartTotal > 100 && (
                <p className={styles.freeShipping}>✓ Free shipping applied</p>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
