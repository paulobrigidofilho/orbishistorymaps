///////////////////////////////////////////////////////////////////////
// ========================== CHECKOUT PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// This page handles the checkout process with address and order summary
// Integrates Google Address Autocomplete and dynamic freight calculation

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";

//  ========== Function imports  ========== //
import fetchCart from "./functions/fetchCart";

//  ========== Helper imports  ========== //
import { showMessage, calculateCartTotal } from "./helpers";

//  ========== Freight Helper imports  ========== //
import {
  calculateFreightFromAddress,
  formatCurrency,
  calculateFreeFreightProgress,
} from "../common/auth/helpers/freightHelper";

//  ========== Constants imports  ========== //
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  COUNTRY_NAME_TO_CODE,
  ADDRESS_COMPONENT_TYPES,
  AUTOCOMPLETE_OPTIONS,
} from "../common/auth/constants/addressConstants";

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
    country: DEFAULT_COUNTRY,
  });

  // Address selection state
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // Google Places state
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Freight calculation state
  const [freightResult, setFreightResult] = useState(null);
  const [freightLoading, setFreightLoading] = useState(false);

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

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogle = () => {
      if (window.google?.maps?.places) {
        setIsGoogleLoaded(true);
      }
    };
    checkGoogle();
    const timer = setTimeout(checkGoogle, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isGoogleLoaded && inputRef.current && !autocompleteRef.current && !useSavedAddress && !isManualEntry) {
      initializeAutocomplete();
    }
  }, [isGoogleLoaded, useSavedAddress, isManualEntry]);

  // Update autocomplete country restriction
  useEffect(() => {
    if (autocompleteRef.current && shippingAddress.country) {
      const countryCode = COUNTRY_NAME_TO_CODE[shippingAddress.country] || "nz";
      autocompleteRef.current.setComponentRestrictions({ country: countryCode });
    }
  }, [shippingAddress.country]);

  // Calculate freight when address changes
  useEffect(() => {
    if (shippingAddress.city && shippingAddress.country && cartData) {
      calculateFreight();
    }
  }, [shippingAddress.city, shippingAddress.state, shippingAddress.country, shippingAddress.postal_code, cartData]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Initialize Google Places Autocomplete
  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const countryCode = COUNTRY_NAME_TO_CODE[shippingAddress.country] || "nz";

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        ...AUTOCOMPLETE_OPTIONS,
        componentRestrictions: { country: countryCode },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(place);
    });

    autocompleteRef.current = autocomplete;
  }, [shippingAddress.country]);

  // Handle place selection from autocomplete
  const handlePlaceSelect = (place) => {
    if (!place?.address_components) return;

    const parsed = parseAddressComponents(place.address_components);

    setShippingAddress(prev => ({
      ...prev,
      street_address: parsed.streetAddress,
      city: parsed.city,
      state: parsed.state,
      postal_code: parsed.postalCode,
      country: parsed.country || prev.country,
    }));

    setErrors({});
  };

  // Parse Google address components
  const parseAddressComponents = (components) => {
    const result = {
      streetNumber: "",
      route: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };

    components.forEach((component) => {
      const type = component.types[0];

      switch (type) {
        case ADDRESS_COMPONENT_TYPES.STREET_NUMBER:
          result.streetNumber = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.ROUTE:
          result.route = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.LOCALITY:
          result.city = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.SUBLOCALITY:
          if (!result.city) result.city = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.ADMIN_AREA_1:
          result.state = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.POSTAL_CODE:
          result.postalCode = component.long_name;
          break;
        case ADDRESS_COMPONENT_TYPES.COUNTRY:
          result.country = component.long_name;
          break;
      }
    });

    result.streetAddress = [result.streetNumber, result.route].filter(Boolean).join(" ");
    return result;
  };

  // Calculate freight for current address
  const calculateFreight = async () => {
    if (!shippingAddress.city || !shippingAddress.country) return;

    const cartTotal = calculateCartTotal(cartData?.items || []);
    
    setFreightLoading(true);
    try {
      const result = await calculateFreightFromAddress(
        {
          country: shippingAddress.country,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postal_code,
        },
        cartTotal
      );

      if (result.success) {
        setFreightResult(result.data);
      } else {
        setFreightResult(null);
      }
    } catch (error) {
      console.error("Error calculating freight:", error);
      setFreightResult(null);
    } finally {
      setFreightLoading(false);
    }
  };

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
        country: user.country || DEFAULT_COUNTRY,
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

  // Handle country change
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setShippingAddress({
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: newCountry,
    });
    setFreightResult(null);
    setErrors({});

    // Reinitialize autocomplete
    if (autocompleteRef.current) {
      autocompleteRef.current = null;
    }
    setTimeout(() => {
      if (!useSavedAddress && !isManualEntry) {
        initializeAutocomplete();
      }
    }, 100);
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
      country: DEFAULT_COUNTRY,
    });
    setFreightResult(null);
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

    // Store shipping address and freight data in session storage for payment page
    sessionStorage.setItem("checkoutAddress", JSON.stringify(shippingAddress));
    sessionStorage.setItem("checkoutCart", JSON.stringify(cartData));
    sessionStorage.setItem("checkoutFreight", JSON.stringify(freightResult));

    // Navigate to payment page
    navigate("/payment");
  };

  // Calculate totals
  const cartTotal = calculateCartTotal(cartData?.items || []);
  const shippingCost = freightResult?.freightCost ?? (cartTotal > 100 ? 0 : 10);
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
                {/* Country Selection */}
                <div className={styles.formGroup}>
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleCountryChange}
                    className={errors.country ? styles.error : ""}
                  >
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <span className={styles.errorMessage}>{errors.country}</span>
                  )}
                </div>

                {/* Street Address with Autocomplete */}
                <div className={styles.formGroup}>
                  <label htmlFor="street_address">
                    Street Address *
                    {isGoogleLoaded && (
                      <button
                        type="button"
                        onClick={() => setIsManualEntry(!isManualEntry)}
                        className={styles.toggleManualEntry}
                      >
                        {isManualEntry ? "Use Autocomplete" : "Enter Manually"}
                      </button>
                    )}
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="street_address"
                    name="street_address"
                    placeholder={isGoogleLoaded && !isManualEntry ? "Start typing your address..." : ""}
                    value={shippingAddress.street_address}
                    onChange={handleInputChange}
                    className={errors.street_address ? styles.error : ""}
                  />
                  {errors.street_address && (
                    <span className={styles.errorMessage}>
                      {errors.street_address}
                    </span>
                  )}
                  {isGoogleLoaded && !isManualEntry && (
                    <span className={styles.autocompleteHint}>
                      Select from suggestions or click "Enter Manually"
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
                </div>

                {/* Freight Zone Display */}
                {(freightLoading || freightResult) && (
                  <div className={styles.freightZoneInfo}>
                    {freightLoading ? (
                      <p className={styles.freightLoading}>Calculating shipping...</p>
                    ) : freightResult && (
                      <FreightZoneDisplay 
                        freightResult={freightResult} 
                        cartTotal={cartTotal} 
                      />
                    )}
                  </div>
                )}

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
                    NZD ${(item.price_at_addition * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>NZD ${cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping {freightResult?.zoneDisplayName ? `(${freightResult.zoneDisplayName})` : ""}</span>
                <span>
                  {freightLoading ? (
                    "Calculating..."
                  ) : freightResult?.isFreeFreight ? (
                    <span className={styles.freeShippingText}>FREE</span>
                  ) : (
                    `NZD $${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              {freightResult?.isFreeFreight && (
                <p className={styles.freeShipping}>✓ Free shipping applied!</p>
              )}
              {!freightResult?.isFreeFreight && freightResult?.amountForFreeFreight > 0 && (
                <div className={styles.freeShippingProgress}>
                  <div className={styles.progressBarContainer}>
                    <div 
                      className={styles.progressBarFill}
                      style={{ width: `${calculateFreeFreightProgress(cartTotal, freightResult.threshold).progress}%` }}
                    />
                  </div>
                  <p className={styles.progressText}>
                    Add {formatCurrency(freightResult.amountForFreeFreight)} more for free shipping
                  </p>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>NZD ${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ================ FREIGHT ZONE DISPLAY COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

function FreightZoneDisplay({ freightResult, cartTotal }) {
  const zoneColors = {
    local: { bg: "#e8f5e9", text: "#2e7d32", border: "#4caf50" },
    north_island: { bg: "#e3f2fd", text: "#1565c0", border: "#2196f3" },
    south_island: { bg: "#e1f5fe", text: "#0277bd", border: "#03a9f4" },
    intl_north_america: { bg: "#fff3e0", text: "#e65100", border: "#ff9800" },
    intl_asia: { bg: "#fbe9e7", text: "#bf360c", border: "#ff5722" },
    intl_europe: { bg: "#f3e5f5", text: "#6a1b9a", border: "#9c27b0" },
    intl_latin_america: { bg: "#fce4ec", text: "#880e4f", border: "#e91e63" },
  };

  const colors = zoneColors[freightResult.zone] || { bg: "#f5f5f5", text: "#616161", border: "#9e9e9e" };
  const progress = calculateFreeFreightProgress(cartTotal, freightResult.threshold);

  return (
    <div className={styles.freightZoneContainer}>
      {/* Zone Badge */}
      <div className={styles.zoneBadge}>
        <span
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          📍 {freightResult.zoneDisplayName}
        </span>
      </div>

      {/* Shipping Cost */}
      <div className={styles.shippingCostInfo}>
        {freightResult.isFreeFreight ? (
          <span className={styles.freeShippingBadge}>
            ✓ Free Shipping Applied!
          </span>
        ) : (
          <span>
            Estimated Shipping: <strong>{formatCurrency(freightResult.freightCost)}</strong>
          </span>
        )}
      </div>

      {/* Free Freight Progress */}
      {!freightResult.isFreeFreight && freightResult.amountForFreeFreight > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.miniProgressBar}>
            <div
              className={styles.miniProgressFill}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className={styles.miniProgressText}>
            Add {progress.formattedRemaining} more for free shipping
          </p>
        </div>
      )}
    </div>
  );
}
