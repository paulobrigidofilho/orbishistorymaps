///////////////////////////////////////////////////////////////////////
// ================ USE ADDRESS AUTOCOMPLETE HOOK ================== //
///////////////////////////////////////////////////////////////////////

// Custom React hook for Google Places Autocomplete integration
// Handles address selection, parsing, and freight zone detection

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  DEFAULT_COUNTRY_CODE,
  COUNTRY_NAME_TO_CODE,
  ADDRESS_COMPONENT_TYPES,
  AUTOCOMPLETE_OPTIONS,
} from "../constants/addressConstants";
import { calculateFreightFromAddress } from "../helpers/freightHelper";

///////////////////////////////////////////////////////////////////////
// ================ HOOK DEFINITION ================================ //
///////////////////////////////////////////////////////////////////////

/**
 * Custom hook for Google Places Autocomplete
 * @param {Object} options - Hook options
 * @param {string} options.initialCountry - Initial country (default: "New Zealand")
 * @param {Function} options.onAddressSelect - Callback when address is selected
 * @param {Function} options.onFreightCalculated - Callback when freight is calculated
 * @param {number} options.orderTotal - Order total for freight calculation
 * @returns {Object} Hook state and functions
 */
const useAddressAutocomplete = (options = {}) => {
  const {
    initialCountry = DEFAULT_COUNTRY,
    onAddressSelect,
    onFreightCalculated,
    orderTotal = 0,
  } = options;

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE ================================= //
  ///////////////////////////////////////////////////////////////////////

  // Address fields state
  const [address, setAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState(initialCountry);

  // Google Places state
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  // Freight calculation state
  const [freightResult, setFreightResult] = useState(null);
  const [freightLoading, setFreightLoading] = useState(false);
  const [freightError, setFreightError] = useState(null);

  // UI state
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Refs
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= EFFECTS =============================== //
  ///////////////////////////////////////////////////////////////////////

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
      }
    };

    // Check immediately
    checkGoogleMapsLoaded();

    // Also check after a delay in case script is still loading
    const timer = setTimeout(checkGoogleMapsLoaded, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize autocomplete when input ref and Google Maps are ready
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      initializeAutocomplete();
    }
  }, [isLoaded, inputRef.current]);

  // Update autocomplete country restriction when country changes
  useEffect(() => {
    if (autocompleteRef.current && country) {
      const countryCode = COUNTRY_NAME_TO_CODE[country] || DEFAULT_COUNTRY_CODE;
      autocompleteRef.current.setComponentRestrictions({
        country: countryCode,
      });
    }
  }, [country]);

  // Calculate freight when address fields change
  useEffect(() => {
    if (city && state && country) {
      calculateFreight();
    }
  }, [city, state, country, postalCode, orderTotal]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= FUNCTIONS ============================= //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Initialize Google Places Autocomplete
   */
  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const countryCode = COUNTRY_NAME_TO_CODE[country] || DEFAULT_COUNTRY_CODE;

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        ...AUTOCOMPLETE_OPTIONS,
        componentRestrictions: { country: countryCode },
      }
    );

    // Listen for place selection
    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();
      handlePlaceSelect(place);
    });

    autocompleteRef.current = autocompleteInstance;
    setAutocomplete(autocompleteInstance);
  }, [country]);

  /**
   * Handle place selection from autocomplete
   * @param {Object} place - Google Place object
   */
  const handlePlaceSelect = useCallback((place) => {
    if (!place || !place.address_components) {
      console.warn("Invalid place selected");
      return;
    }

    // Parse address components
    const parsedAddress = parseAddressComponents(place.address_components);

    // Update state
    setAddress(parsedAddress.streetAddress);
    setCity(parsedAddress.city);
    setState(parsedAddress.state);
    setPostalCode(parsedAddress.postalCode);
    setCountry(parsedAddress.country || country);
    setGooglePlaceId(place.place_id || "");
    setFormattedAddress(place.formatted_address || "");
    setIsManualEntry(false);

    // Call callback if provided
    if (onAddressSelect) {
      onAddressSelect({
        ...parsedAddress,
        googlePlaceId: place.place_id,
        formattedAddress: place.formatted_address,
      });
    }
  }, [country, onAddressSelect]);

  /**
   * Parse Google address components into structured data
   * @param {Array} components - Address components from Google
   * @returns {Object} Parsed address data
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
          // Use sublocality as city if locality is not available
          if (!result.city) {
            result.city = component.long_name;
          }
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

    // Combine street number and route
    result.streetAddress = [result.streetNumber, result.route]
      .filter(Boolean)
      .join(" ");

    return result;
  };

  /**
   * Calculate freight for current address
   */
  const calculateFreight = useCallback(async () => {
    if (!city || !country) return;

    setFreightLoading(true);
    setFreightError(null);

    try {
      const result = await calculateFreightFromAddress(
        {
          country,
          city,
          state,
          postalCode,
          formattedAddress,
        },
        orderTotal
      );

      setFreightResult(result.success ? result.data : null);

      if (!result.success) {
        setFreightError(result.error);
      }

      if (onFreightCalculated) {
        onFreightCalculated(result);
      }
    } catch (error) {
      setFreightError(error.message);
      setFreightResult(null);
    } finally {
      setFreightLoading(false);
    }
  }, [city, state, country, postalCode, formattedAddress, orderTotal, onFreightCalculated]);

  /**
   * Reset all address fields
   */
  const resetAddress = useCallback(() => {
    setAddress("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setGooglePlaceId("");
    setFormattedAddress("");
    setFreightResult(null);
    setFreightError(null);
    setIsManualEntry(false);
  }, []);

  /**
   * Set address from existing data (e.g., loading user profile)
   * @param {Object} addressData - Existing address data
   */
  const setAddressFromData = useCallback((addressData) => {
    if (!addressData) return;

    setAddress(addressData.address || addressData.street_address || "");
    setAddressLine2(addressData.addressLine2 || addressData.address_line_2 || "");
    setCity(addressData.city || "");
    setState(addressData.state || addressData.stateName || "");
    setPostalCode(addressData.postalCode || addressData.zipCode || addressData.postal_code || "");
    setCountry(addressData.country || DEFAULT_COUNTRY);
    setGooglePlaceId(addressData.googlePlaceId || addressData.google_place_id || "");
    setFormattedAddress(addressData.formattedAddress || addressData.formatted_address || "");
  }, []);

  /**
   * Get current address as object
   * @returns {Object} Current address data
   */
  const getAddressData = useCallback(() => {
    return {
      address,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      googlePlaceId,
      formattedAddress,
      isManualEntry,
    };
  }, [address, addressLine2, city, state, postalCode, country, googlePlaceId, formattedAddress, isManualEntry]);

  /**
   * Handle country change
   * @param {string} newCountry - New country name
   */
  const handleCountryChange = useCallback((newCountry) => {
    setCountry(newCountry);
    // Reset address fields when country changes
    setAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setGooglePlaceId("");
    setFormattedAddress("");
    setFreightResult(null);
  }, []);

  /**
   * Switch to manual entry mode
   */
  const enableManualEntry = useCallback(() => {
    setIsManualEntry(true);
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= RETURN ================================ //
  ///////////////////////////////////////////////////////////////////////

  return {
    // Refs
    inputRef,
    
    // Address state
    address,
    setAddress,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    state,
    setState,
    postalCode,
    setPostalCode,
    country,
    setCountry: handleCountryChange,
    
    // Google Places state
    googlePlaceId,
    formattedAddress,
    isLoaded,
    
    // Freight state
    freightResult,
    freightLoading,
    freightError,
    
    // UI state
    isManualEntry,
    setIsManualEntry,
    
    // Constants
    supportedCountries: SUPPORTED_COUNTRIES,
    
    // Functions
    resetAddress,
    setAddressFromData,
    getAddressData,
    calculateFreight,
    enableManualEntry,
    initializeAutocomplete,
  };
};

export default useAddressAutocomplete;
