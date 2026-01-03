//////////////////////////////////
// ===== FULL ADDRESS DIV ===== //
//////////////////////////////////

// This component handles the full address input fields including
// country selection, Google Address Autocomplete, street address,
// apartment/unit, city, state/region, zip code, and freight zone display.

//  ========== Module imports  ========== //
import { useState, useEffect, useRef, useCallback } from "react";

//  ========== Component imports  ========== //
import styles from "../Auth.module.css";
import CountrySelect from "./CountrySelect";

//  ========== Constants imports  ========== //
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  COUNTRY_NAME_TO_CODE,
  ADDRESS_COMPONENT_TYPES,
  AUTOCOMPLETE_OPTIONS,
} from "../constants/addressConstants";

//  ========== Helper imports  ========== //
import { 
  calculateFreightFromAddress, 
  formatCurrency, 
  calculateFreeFreightProgress 
} from "../helpers/freightHelper";

//  ========== Utils imports  ========== //
import { loadGoogleMapsApi, isGoogleMapsLoaded } from "../../../../utils/googleMapsLoader";

// ========== FullAddressDiv Component ========== //

function FullAddressDiv({
  address,
  setAddress,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  stateName,
  setStateName,
  zipCode,
  setZipCode,
  country,
  setCountry,
  capitalizeWords,
  readOnly = false,
  showFreightInfo = false,
  orderTotal = 0,
  onFreightCalculated,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Google Places state
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Freight state
  const [freightResult, setFreightResult] = useState(null);
  const [freightLoading, setFreightLoading] = useState(false);

  // Local country state if not provided externally
  const [localCountry, setLocalCountry] = useState(country || DEFAULT_COUNTRY);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Initialize Google Places Autocomplete
   * Industry standard: Autocomplete triggers after 3+ characters (Google's default)
   */
  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const countryCode = COUNTRY_NAME_TO_CODE[localCountry] || "nz";

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
  }, [localCountry]);

  /**
   * Handle place selection from autocomplete
   */
  const handlePlaceSelect = (place) => {
    if (!place?.address_components) return;

    const parsed = parseAddressComponents(place.address_components);

    setAddress(parsed.streetAddress);
    setCity(parsed.city);
    setStateName(parsed.state);
    setZipCode(parsed.postalCode);
    
    if (parsed.country && setCountry) {
      setCountry(parsed.country);
      setLocalCountry(parsed.country);
    }
  };

  /**
   * Parse Google address components
   */
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

  /**
   * Calculate freight for current address
   */
  const calculateFreight = async () => {
    if (!city || !localCountry) return;

    setFreightLoading(true);
    try {
      const result = await calculateFreightFromAddress(
        { country: localCountry, city, state: stateName, postalCode: zipCode },
        orderTotal
      );

      if (result.success) {
        setFreightResult(result.data);
        if (onFreightCalculated) {
          onFreightCalculated(result.data);
        }
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

  /**
   * Handle country change
   */
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setLocalCountry(newCountry);
    
    if (setCountry) {
      setCountry(newCountry);
    }

    // Reset address fields when country changes
    setAddress("");
    setCity("");
    setStateName("");
    setZipCode("");
    setFreightResult(null);

    // Immediately update autocomplete country restriction (no need to reinitialize)
    if (autocompleteRef.current) {
      const countryCode = COUNTRY_NAME_TO_CODE[newCountry] || "nz";
      autocompleteRef.current.setComponentRestrictions({ country: countryCode });
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= EFFECTS =============================== //
  ///////////////////////////////////////////////////////////////////////

  // Load Google Maps API and check if loaded
  useEffect(() => {
    const initGoogleMaps = async () => {
      // First check if already loaded
      if (isGoogleMapsLoaded()) {
        setIsGoogleLoaded(true);
        return;
      }

      // Try to load the API
      try {
        await loadGoogleMapsApi();
        setIsGoogleLoaded(true);
      } catch (error) {
        console.warn("Google Maps API not available:", error.message);
        // Fall back to manual entry if API fails to load
        setIsManualEntry(true);
      }
    };

    initGoogleMaps();
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only initialize if Google is loaded, input exists, and not in manual/readonly mode
    if (isGoogleLoaded && inputRef.current && !readOnly && !isManualEntry) {
      // Clean up any existing autocomplete before creating a new one
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      initializeAutocomplete();
    }
    
    // Cleanup on unmount or when switching to manual entry
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isGoogleLoaded, readOnly, isManualEntry, initializeAutocomplete]);

  // Update autocomplete country restriction when country changes
  useEffect(() => {
    if (autocompleteRef.current) {
      const countryCode = COUNTRY_NAME_TO_CODE[localCountry] || "nz";
      autocompleteRef.current.setComponentRestrictions({ country: countryCode });
    }
  }, [localCountry]);

  // Sync external country prop
  useEffect(() => {
    if (country && country !== localCountry) {
      setLocalCountry(country);
    }
  }, [country]);

  // Calculate freight when address fields change
  useEffect(() => {
    if (showFreightInfo && city && localCountry) {
      calculateFreight();
    }
  }, [city, stateName, localCountry, zipCode, orderTotal, showFreightInfo]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Full Address</h2>

      {/* Country Selection */}
      <p className={styles.inputLabel}>Country:</p>
      <CountrySelect
        value={localCountry}
        onChange={handleCountryChange}
        disabled={readOnly}
      />

      {/* Street Address with Autocomplete */}
      <p className={styles.inputLabel}>
        Street Address:
        {!readOnly && isGoogleLoaded && (
          <button
            type="button"
            onClick={() => setIsManualEntry(!isManualEntry)}
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
      </p>
      <input
        ref={inputRef}
        type="text"
        placeholder={!readOnly ? "Start typing your street address..." : ""}
        value={address}
        onChange={
          !readOnly
            ? (e) => setAddress(capitalizeWords ? capitalizeWords(e.target.value) : e.target.value)
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />
      {!readOnly && isGoogleLoaded && !isManualEntry && (
        <p style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px", marginBottom: "8px" }}>
          Select from suggestions or click "Enter Manually"
        </p>
      )}

      {/* Unit/Apartment Input */}
      <p className={styles.inputLabel}>
        Apartment / Unit: {!readOnly && "(Optional)"}
      </p>
      <input
        type="text"
        placeholder={!readOnly ? "Unit, Apt, Suite Number" : ""}
        value={addressLine2}
        onChange={!readOnly ? (e) => setAddressLine2(e.target.value) : undefined}
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* City Input */}
      <p className={styles.inputLabel}>City / Suburb:</p>
      <input
        type="text"
        placeholder={!readOnly ? "City or Suburb" : ""}
        value={city}
        onChange={
          !readOnly
            ? (e) => setCity(capitalizeWords ? capitalizeWords(e.target.value) : e.target.value)
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* State/Region Input */}
      <p className={styles.inputLabel}>State / Region:</p>
      <input
        type="text"
        placeholder={!readOnly ? "State or Region" : ""}
        value={stateName}
        onChange={
          !readOnly
            ? (e) => setStateName(capitalizeWords ? capitalizeWords(e.target.value) : e.target.value)
            : undefined
        }
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* Postcode Input */}
      <p className={styles.inputLabel}>Zip Code:</p>
      <input
        type="text"
        placeholder={!readOnly ? "Zip Code or Postcode" : ""}
        value={zipCode}
        onChange={!readOnly ? (e) => setZipCode(e.target.value) : undefined}
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />

      {/* Freight Zone Info */}
      {showFreightInfo && !readOnly && (
        <div style={{ marginTop: "16px" }}>
          {freightLoading ? (
            <p style={{ color: "#666", fontSize: "0.85rem" }}>Calculating shipping...</p>
          ) : freightResult ? (
            <FreightZoneInfo 
              freightResult={freightResult} 
              orderTotal={orderTotal} 
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ================ FREIGHT ZONE INFO SUB-COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

function FreightZoneInfo({ freightResult, orderTotal }) {
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
  const progress = calculateFreeFreightProgress(orderTotal, freightResult.threshold);

  return (
    <div style={{ 
      padding: "12px", 
      backgroundColor: "#f9f9f9", 
      borderRadius: "8px",
      border: "1px solid #e0e0e0"
    }}>
      {/* Zone Badge */}
      <div style={{ marginBottom: "8px" }}>
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
      <div style={{ fontSize: "0.9rem", color: "#333", marginBottom: "8px" }}>
        {freightResult.isFreeFreight ? (
          <span style={{ color: "#2e7d32", fontWeight: "500" }}>
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
        <div>
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#e0e0e0",
              borderRadius: "3px",
              overflow: "hidden",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: `${progress.progress}%`,
                height: "100%",
                backgroundColor: "#2196f3",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "#666", margin: 0 }}>
            Add {progress.formattedRemaining} more for free shipping
          </p>
        </div>
      )}
    </div>
  );
}

export default FullAddressDiv;
