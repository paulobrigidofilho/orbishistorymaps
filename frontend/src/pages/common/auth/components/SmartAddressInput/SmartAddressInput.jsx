///////////////////////////////////////////////////////////////////////
// ================ SMART ADDRESS INPUT COMPONENT ================== //
///////////////////////////////////////////////////////////////////////

// Enhanced address input with context-aware autocomplete
// Filters suggestions based on other filled address fields

//  ========== Module imports  ========== //
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SmartAddressInput.module.css";

//  ========== Constants imports  ========== //
import {
  COUNTRY_NAME_TO_CODE,
  ADDRESS_COMPONENT_TYPES,
} from "../../constants/addressConstants";

//  ========== Validator imports  ========== //
import { isStreetFirstCountry } from "../../validators/addressValidator";

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function SmartAddressInput({
  // Field identification
  fieldType = "street", // "street" | "city" | "state" | "zipCode"
  
  // Value and onChange
  value = "",
  onChange,
  
  // Context from other fields (for filtering)
  country = "New Zealand",
  city = "",
  state = "",
  zipCode = "",
  streetAddress = "",
  
  // UI props
  placeholder = "",
  readOnly = false,
  className = "",
  inputClassName = "",
  
  // Callbacks
  onPlaceSelect,
  capitalizeWords,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE ================================= //
  ///////////////////////////////////////////////////////////////////////

  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [sessionToken, setSessionToken] = useState(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const debounceTimerRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= INITIALIZATION ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Initialize Google services
  useEffect(() => {
    if (window.google?.maps?.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (required by API)
      const dummyDiv = document.createElement("div");
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv);
      
      // Create initial session token
      setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
    }
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPERS =============================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Normalize text by removing diacritics/accents
   * Supports Brazilian & European Portuguese characters:
   * - Accents: á, à, â, ã, é, ê, í, ó, ô, õ, ú
   * - Cedilla: ç (Açúcar → Acucar, Praça → Praca)
   * Allows "Cafe" to match "Café", "Sao" to match "São", etc.
   * @param {string} text - Text to normalize
   * @returns {string} Normalized text without accents
   */
  const normalizeAccents = useCallback((text) => {
    if (!text) return "";
    // NFD decomposes characters:
    // - é → e + ́ (combining acute accent)
    // - ç → c + ̧ (combining cedilla U+0327)
    // - ã → a + ̃ (combining tilde)
    // Remove all combining diacritical marks including cedilla
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f\u0327\u0328]/g, "");
  }, []);

  /**
   * Build search query with context from other fields
   * Normalizes accents so "Cafe" finds "Café"
   */
  const buildSearchQuery = useCallback((inputValue) => {
    const parts = [];
    
    // Add the input value (keep original for display, normalize for search)
    if (inputValue) {
      parts.push(inputValue);
    }
    
    // Add context based on field type
    switch (fieldType) {
      case "street":
        // For street search, add city and state context
        if (city) parts.push(city);
        if (state) parts.push(state);
        break;
      case "city":
        // For city search, add state context
        if (state) parts.push(state);
        break;
      case "state":
        // State search doesn't need additional context
        break;
      case "zipCode":
        // For zip code, add city and state context
        if (city) parts.push(city);
        if (state) parts.push(state);
        break;
    }
    
    return parts.join(", ");
  }, [fieldType, city, state]);

  /**
   * Get autocomplete types based on field
   */
  const getAutocompleteTypes = useCallback(() => {
    switch (fieldType) {
      case "street":
        return ["address"];
      case "city":
        return ["(cities)"];
      case "state":
        return ["(regions)"];
      case "zipCode":
        return ["postal_code"];
      default:
        return ["address"];
    }
  }, [fieldType]);

  /**
   * Parse place details into address components
   * Formats street address based on country conventions:
   * - Brazil/Portugal: "Rua das Flores, 123" (street, number)
   * - NZ/AU/US/UK: "123 Main Street" (number street)
   */
  const parsePlaceDetails = useCallback((place) => {
    if (!place?.address_components) return null;

    const result = {
      streetNumber: "",
      route: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      formattedAddress: place.formatted_address || "",
    };

    place.address_components.forEach((component) => {
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
        case ADDRESS_COMPONENT_TYPES.ADMIN_AREA_2:
          // Used in Brazil and other countries where city is admin_area_level_2
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

    // Format street address based on country conventions
    if (result.route && result.streetNumber) {
      if (isStreetFirstCountry(result.country)) {
        // Brazil/Portugal: "Rua das Flores, 123"
        result.streetAddress = `${result.route}, ${result.streetNumber}`;
      } else {
        // NZ/AU/US/UK: "123 Main Street"
        result.streetAddress = `${result.streetNumber} ${result.route}`;
      }
    } else if (result.route) {
      result.streetAddress = result.route;
    } else if (result.streetNumber) {
      result.streetAddress = result.streetNumber;
    }
    
    return result;
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= SEARCH ================================ //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Fetch suggestions from Google Places
   * Tries both original and accent-normalized queries for better results
   */
  const fetchSuggestions = useCallback(async (inputValue) => {
    if (!autocompleteServiceRef.current || !inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const countryCode = COUNTRY_NAME_TO_CODE[country] || "nz";
      const searchQuery = buildSearchQuery(inputValue);
      const normalizedQuery = normalizeAccents(searchQuery);
      
      // Check if query has accents that were normalized
      const hasAccentDifference = searchQuery !== normalizedQuery;
      
      const request = {
        input: searchQuery,
        componentRestrictions: { country: countryCode },
        types: getAutocompleteTypes(),
        sessionToken: sessionToken,
      };

      // First try with the original query
      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
            // Got results with original query
            setIsLoading(false);
            const filteredPredictions = filterPredictions(predictions, inputValue);
            setSuggestions(filteredPredictions.slice(0, 10));
            setIsOpen(filteredPredictions.length > 0);
          } else if (!hasAccentDifference) {
            // No results and query was already without accents, try normalized anyway
            // This helps when user types "Cafe" but API has "Café"
            const normalizedRequest = {
              ...request,
              input: normalizedQuery,
            };
            
            autocompleteServiceRef.current.getPlacePredictions(
              normalizedRequest,
              (normalizedPredictions, normalizedStatus) => {
                setIsLoading(false);
                
                if (normalizedStatus === window.google.maps.places.PlacesServiceStatus.OK && normalizedPredictions) {
                  const filteredPredictions = filterPredictions(normalizedPredictions, inputValue);
                  setSuggestions(filteredPredictions.slice(0, 10));
                  setIsOpen(filteredPredictions.length > 0);
                } else {
                  setSuggestions([]);
                  setIsOpen(false);
                }
              }
            );
          } else {
            setIsLoading(false);
            setSuggestions([]);
            setIsOpen(false);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setIsLoading(false);
      setSuggestions([]);
    }
  }, [country, buildSearchQuery, normalizeAccents, getAutocompleteTypes, sessionToken]);

  /**
   * Filter predictions for better relevance
   * Uses accent-insensitive comparison
   */
  const filterPredictions = useCallback((predictions, inputValue) => {
    const lowerInput = normalizeAccents(inputValue.toLowerCase());
    
    return predictions.filter((prediction) => {
      // Normalize the prediction text for accent-insensitive comparison
      const mainText = normalizeAccents(prediction.structured_formatting?.main_text?.toLowerCase() || "");
      const fullText = normalizeAccents(prediction.description?.toLowerCase() || "");
      
      // For street search, prioritize results that match the street name
      if (fieldType === "street") {
        // Check if the main text contains the input (accent-insensitive)
        if (mainText.includes(lowerInput)) return true;
        // Also check the full description
        return fullText.includes(lowerInput);
      }
      
      // For other fields, allow all results
      return true;
    });
  }, [fieldType, normalizeAccents]);

  /**
   * Handle suggestion selection
   */
  const handleSelectSuggestion = useCallback(async (prediction) => {
    if (!placesServiceRef.current) return;

    setIsLoading(true);
    
    // Fetch full place details
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["address_components", "formatted_address", "geometry", "name"],
        sessionToken: sessionToken,
      },
      (place, status) => {
        setIsLoading(false);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const parsed = parsePlaceDetails(place);
          
          if (parsed) {
            // Update this field's value based on field type
            let newValue = "";
            switch (fieldType) {
              case "street":
                newValue = parsed.streetAddress || parsed.formattedAddress.split(",")[0];
                break;
              case "city":
                newValue = parsed.city;
                break;
              case "state":
                newValue = parsed.state;
                break;
              case "zipCode":
                newValue = parsed.postalCode;
                break;
            }
            
            onChange(newValue);
            
            // Notify parent with full address data
            if (onPlaceSelect) {
              onPlaceSelect(parsed);
            }
          }
        }
        
        // Create new session token after selection
        setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
        setIsOpen(false);
        setSuggestions([]);
      }
    );
  }, [fieldType, sessionToken, parsePlaceDetails, onChange, onPlaceSelect]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= EVENT HANDLERS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    if (capitalizeWords) {
      newValue = capitalizeWords(newValue);
    }
    
    onChange(newValue);
    
    // Debounce the search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleInputFocus = () => {
    if (value && suggestions.length > 0) {
      setIsOpen(true);
    } else if (value && value.length >= 2) {
      fetchSuggestions(value);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on suggestion
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= EFFECTS =============================== //
  ///////////////////////////////////////////////////////////////////////

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= RENDER ================================ //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={`${styles.smartAddressInput} ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={readOnly ? undefined : handleInputChange}
        onFocus={readOnly ? undefined : handleInputFocus}
        onBlur={readOnly ? undefined : handleInputBlur}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${styles.input} ${inputClassName} ${readOnly ? styles.readOnly : ""}`}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <span className={styles.spinner}></span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className={styles.dropdown}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place_id}
              className={`${styles.suggestion} ${
                index === highlightedIndex ? styles.highlighted : ""
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <span className={styles.mainText}>
                {suggestion.structured_formatting?.main_text || suggestion.description}
              </span>
              {suggestion.structured_formatting?.secondary_text && (
                <span className={styles.secondaryText}>
                  {suggestion.structured_formatting.secondary_text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
