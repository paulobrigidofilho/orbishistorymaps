///////////////////////////////////////////////////////////////////////
// ================ GOOGLE ADDRESS AUTOCOMPLETE ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable component for Google Places address autocomplete
// Includes country selection and freight zone display

import { useEffect, useState, useRef } from "react";
import styles from "../Auth.module.css";
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  COUNTRY_NAME_TO_CODE,
  getZoneDisplayName,
} from "../constants/addressConstants";
import { formatCurrency, calculateFreeFreightProgress } from "../helpers/freightHelper";

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Google Address Autocomplete Component
 * @param {Object} props - Component props
 * @param {Function} props.onAddressChange - Callback when address fields change
 * @param {Object} props.addressData - Current address data
 * @param {Object} props.freightResult - Freight calculation result
 * @param {boolean} props.freightLoading - Loading state for freight
 * @param {number} props.orderTotal - Order total for free freight progress
 * @param {boolean} props.showFreightInfo - Whether to show freight zone info
 * @param {boolean} props.readOnly - Read-only mode
 * @param {string} props.variant - Style variant ("profile" | "checkout")
 * @param {React.RefObject} props.inputRef - Ref for the autocomplete input
 */
function GoogleAddressAutocomplete({
  onAddressChange,
  addressData = {},
  freightResult,
  freightLoading = false,
  orderTotal = 0,
  showFreightInfo = true,
  readOnly = false,
  variant = "profile",
  inputRef,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE ================================= //
  ///////////////////////////////////////////////////////////////////////

  const [localAddress, setLocalAddress] = useState(addressData.address || "");
  const [localCity, setLocalCity] = useState(addressData.city || "");
  const [localState, setLocalState] = useState(addressData.state || "");
  const [localPostalCode, setLocalPostalCode] = useState(addressData.postalCode || "");
  const [localCountry, setLocalCountry] = useState(addressData.country || DEFAULT_COUNTRY);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Internal ref if no external ref provided
  const internalRef = useRef(null);
  const autocompleteInputRef = inputRef || internalRef;

  ///////////////////////////////////////////////////////////////////////
  // ========================= EFFECTS =============================== //
  ///////////////////////////////////////////////////////////////////////

  // Sync with external address data
  useEffect(() => {
    if (addressData) {
      setLocalAddress(addressData.address || "");
      setLocalCity(addressData.city || "");
      setLocalState(addressData.state || "");
      setLocalPostalCode(addressData.postalCode || "");
      setLocalCountry(addressData.country || DEFAULT_COUNTRY);
    }
  }, [addressData]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HANDLERS ============================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Handle input change and notify parent
   */
  const handleInputChange = (field, value) => {
    const setters = {
      address: setLocalAddress,
      city: setLocalCity,
      state: setLocalState,
      postalCode: setLocalPostalCode,
    };

    if (setters[field]) {
      setters[field](value);
    }

    if (onAddressChange) {
      onAddressChange({
        address: field === "address" ? value : localAddress,
        city: field === "city" ? value : localCity,
        state: field === "state" ? value : localState,
        postalCode: field === "postalCode" ? value : localPostalCode,
        country: localCountry,
      });
    }
  };

  /**
   * Handle country selection
   */
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setLocalCountry(newCountry);
    
    // Reset address fields when country changes
    setLocalAddress("");
    setLocalCity("");
    setLocalState("");
    setLocalPostalCode("");
    setIsManualEntry(false);

    if (onAddressChange) {
      onAddressChange({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: newCountry,
      });
    }
  };

  /**
   * Toggle manual entry mode
   */
  const toggleManualEntry = () => {
    setIsManualEntry(!isManualEntry);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= RENDER HELPERS ======================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Render freight zone badge
   */
  const renderZoneBadge = () => {
    if (!freightResult || !showFreightInfo) return null;

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

    return (
      <div
        className={styles.zoneBadge}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          borderColor: colors.border,
          border: `1px solid ${colors.border}`,
          padding: "4px 12px",
          borderRadius: "16px",
          fontSize: "0.85rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>📍</span>
        <span>{freightResult.zoneDisplayName}</span>
      </div>
    );
  };

  /**
   * Render freight info section
   */
  const renderFreightInfo = () => {
    if (!showFreightInfo || readOnly) return null;

    return (
      <div className={styles.freightInfoContainer} style={{ marginTop: "12px" }}>
        {freightLoading ? (
          <div className={styles.freightLoading} style={{ color: "#666", fontSize: "0.9rem" }}>
            Calculating shipping...
          </div>
        ) : freightResult ? (
          <div className={styles.freightInfo}>
            {/* Zone Badge */}
            <div style={{ marginBottom: "8px" }}>
              {renderZoneBadge()}
            </div>

            {/* Shipping Cost */}
            <div style={{ fontSize: "0.9rem", color: "#333" }}>
              {freightResult.isFreeFreight ? (
                <span style={{ color: "#2e7d32", fontWeight: "500" }}>
                  ✓ Free Shipping!
                </span>
              ) : (
                <span>
                  Shipping: <strong>{formatCurrency(freightResult.freightCost)}</strong>
                </span>
              )}
            </div>

            {/* Free Freight Progress */}
            {!freightResult.isFreeFreight && freightResult.amountForFreeFreight > 0 && (
              <div style={{ marginTop: "8px" }}>
                <FreeFreightProgress
                  orderTotal={orderTotal}
                  threshold={freightResult.threshold}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.googleAddressContainer}>
      {/* Country Selection */}
      <div className={styles.formGroup} style={{ marginBottom: "16px" }}>
        <label className={styles.inputLabel}>Country:</label>
        <select
          value={localCountry}
          onChange={handleCountryChange}
          disabled={readOnly}
          className={`${styles.inputField} ${styles.selectField}`}
          style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
        >
          {SUPPORTED_COUNTRIES.map((country) => (
            <option key={country.code} value={country.name}>
              {country.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Address Autocomplete Input */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>
          Street Address:
          {!readOnly && (
            <button
              type="button"
              onClick={toggleManualEntry}
              className={styles.manualEntryToggle}
              style={{
                marginLeft: "8px",
                fontSize: "0.75rem",
                color: "#666",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isManualEntry ? "Use Autocomplete" : "Enter Manually"}
            </button>
          )}
        </label>
        <input
          ref={autocompleteInputRef}
          type="text"
          placeholder={readOnly ? "" : "Start typing your address..."}
          value={localAddress}
          onChange={(e) => handleInputChange("address", e.target.value)}
          readOnly={readOnly}
          className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
        />
        {!readOnly && !isManualEntry && (
          <p className={styles.inputHint} style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>
            Select from suggestions or enter manually
          </p>
        )}
      </div>

      {/* City Input */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>City / Suburb:</label>
        <input
          type="text"
          placeholder={readOnly ? "" : "City or Suburb"}
          value={localCity}
          onChange={(e) => handleInputChange("city", e.target.value)}
          readOnly={readOnly}
          className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
        />
      </div>

      {/* State/Region Input */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>State / Region:</label>
        <input
          type="text"
          placeholder={readOnly ? "" : "State or Region"}
          value={localState}
          onChange={(e) => handleInputChange("state", e.target.value)}
          readOnly={readOnly}
          className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
        />
      </div>

      {/* Postal Code Input */}
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Postal Code:</label>
        <input
          type="text"
          placeholder={readOnly ? "" : "Postal Code"}
          value={localPostalCode}
          onChange={(e) => handleInputChange("postalCode", e.target.value)}
          readOnly={readOnly}
          className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
        />
      </div>

      {/* Freight Info */}
      {renderFreightInfo()}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ================ FREE FREIGHT PROGRESS COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

/**
 * Progress bar showing how close to free freight threshold
 */
function FreeFreightProgress({ orderTotal, threshold }) {
  const progress = calculateFreeFreightProgress(orderTotal, threshold);

  return (
    <div className={styles.freeFreightProgress}>
      <div
        className={styles.progressBar}
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          className={styles.progressFill}
          style={{
            width: `${progress.progress}%`,
            height: "100%",
            backgroundColor: progress.isQualified ? "#4caf50" : "#2196f3",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p
        className={styles.progressText}
        style={{ fontSize: "0.8rem", color: "#666", marginTop: "4px" }}
      >
        {progress.isQualified ? (
          <span style={{ color: "#2e7d32" }}>✓ You qualify for free shipping!</span>
        ) : (
          <span>
            Add {progress.formattedRemaining} more for free shipping
          </span>
        )}
      </p>
    </div>
  );
}

export default GoogleAddressAutocomplete;
export { FreeFreightProgress };
