///////////////////////////////////////////////////////////////////////
// ================ ADDRESS VALIDATOR ============================== //
///////////////////////////////////////////////////////////////////////

// This validator handles address validation with support for:
// - Multiple address formats (NZ/US: number before street, BR/PT: street before number)
// - Flexible zip code formats (with/without hyphens for Brazil)
// - Google Places API validation
// - All-or-nothing address field requirement

import { z } from "zod";
import { COUNTRY_NAME_TO_CODE } from "../constants/addressConstants";

///////////////////////////////////////////////////////////////////////
// ================ CONSTANTS ====================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Countries where the address format is: Street Name, Number
 * (Most Latin/European countries)
 */
export const STREET_FIRST_COUNTRIES = ["Brazil", "Portugal"];

/**
 * Countries where the address format is: Number Street Name
 * (Anglo-Saxon countries)
 */
export const NUMBER_FIRST_COUNTRIES = [
  "New Zealand",
  "Australia",
  "United States",
  "Canada",
  "United Kingdom",
];

/**
 * Zip code patterns by country
 * Supports formats with and without hyphens/spaces
 */
export const ZIP_CODE_PATTERNS = {
  // Brazil: 12345-678 or 12345678 (8 digits, optional hyphen after 5th)
  Brazil: /^\d{5}-?\d{3}$/,
  
  // Portugal: 1234-567 or 1234567 (7 digits, optional hyphen after 4th)
  Portugal: /^\d{4}-?\d{3}$/,
  
  // New Zealand: 4 digits
  "New Zealand": /^\d{4}$/,
  
  // Australia: 4 digits
  Australia: /^\d{4}$/,
  
  // United States: 5 digits or 5+4 format (12345 or 12345-6789)
  "United States": /^\d{5}(-\d{4})?$/,
  
  // Canada: A1A 1A1 format (letter-number-letter space number-letter-number)
  Canada: /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/,
  
  // United Kingdom: Various formats (SW1A 1AA, M1 1AE, etc.)
  "United Kingdom": /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
  
  // China: 6 digits
  China: /^\d{6}$/,
};

/**
 * Error messages for address validation
 */
export const ADDRESS_VALIDATION_ERRORS = {
  INCOMPLETE_ADDRESS: "Please fill in all address fields or leave them all empty",
  INVALID_STREET_FORMAT: "Invalid street address format",
  INVALID_STREET_FORMAT_NUMBER_FIRST: "Street address should start with a number (e.g., '123 Main Street')",
  INVALID_STREET_FORMAT_STREET_FIRST: "Street address should be in format: 'Street Name, Number' (e.g., 'Rua das Flores, 123')",
  INVALID_ZIP_CODE: "Invalid zip code format for the selected country",
  CITY_REQUIRED: "City is required when address is provided",
  STATE_REQUIRED: "State/Region is required when address is provided",
  COUNTRY_REQUIRED: "Country is required when address is provided",
  ADDRESS_NOT_FOUND: "Address not found. Please verify or enter manually",
  GOOGLE_API_ERROR: "Unable to validate address. Please try again",
};

///////////////////////////////////////////////////////////////////////
// ================ HELPER FUNCTIONS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Normalize text by removing diacritics/accents
 * Supports both Brazilian Portuguese and European Portuguese characters:
 * - Accents: á, à, â, ã, é, ê, í, ó, ô, õ, ú (Brazilian & Portuguese)
 * - Cedilla: ç (common in both)
 * - Allows "Cafe" to match "Café", "Sao" to match "São", "Acucar" to match "Açúcar"
 * Useful for keyboards without special characters
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text without accents
 */
export const normalizeAccents = (text) => {
  if (!text) return "";
  // NFD decomposes characters:
  // - é → e + ́ (combining acute accent U+0301)
  // - ç → c + ̧ (combining cedilla U+0327)
  // - ã → a + ̃ (combining tilde U+0303)
  // Then we remove all combining diacritical marks:
  // - U+0300-U+036F: Combining Diacritical Marks (accents, tildes, etc.)
  // - U+0327: Combining Cedilla (for ç)
  // - U+0328: Combining Ogonek (Polish, Lithuanian)
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u0327\u0328]/g, "");
};

/**
 * Check if a country uses "Street Name, Number" format
 * @param {string} country - Country name
 * @returns {boolean} True if country uses street-first format
 */
export const isStreetFirstCountry = (country) => {
  return STREET_FIRST_COUNTRIES.includes(country);
};

/**
 * Normalize zip code by removing common separators
 * @param {string} zipCode - The zip code to normalize
 * @returns {string} Normalized zip code
 */
export const normalizeZipCode = (zipCode) => {
  if (!zipCode) return "";
  return zipCode.trim();
};

/**
 * Validate zip code format for a specific country
 * @param {string} zipCode - The zip code to validate
 * @param {string} country - The country for format validation
 * @returns {boolean} True if valid
 */
export const isValidZipCode = (zipCode, country) => {
  if (!zipCode) return false;
  
  const pattern = ZIP_CODE_PATTERNS[country];
  if (!pattern) {
    // For unsupported countries, accept any non-empty string
    return zipCode.trim().length > 0;
  }
  
  return pattern.test(zipCode.trim());
};

/**
 * Get expected zip code format hint for a country
 * @param {string} country - Country name
 * @returns {string} Format hint
 */
export const getZipCodeHint = (country) => {
  const hints = {
    Brazil: "e.g., 24230-310 or 24230310",
    Portugal: "e.g., 1234-567 or 1234567",
    "New Zealand": "e.g., 3110",
    Australia: "e.g., 2000",
    "United States": "e.g., 12345 or 12345-6789",
    Canada: "e.g., K1A 0B1",
    "United Kingdom": "e.g., SW1A 1AA",
    China: "e.g., 100000",
  };
  return hints[country] || "Enter your postal code";
};

/**
 * Validate street address format based on country
 * @param {string} streetAddress - The street address
 * @param {string} country - The country for format validation
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateStreetFormat = (streetAddress, country) => {
  if (!streetAddress || streetAddress.trim().length === 0) {
    return { valid: false, error: "Street address is required" };
  }

  const trimmed = streetAddress.trim();
  
  // Minimum length check
  if (trimmed.length < 3) {
    return { valid: false, error: "Street address is too short" };
  }

  // Check format based on country
  if (isStreetFirstCountry(country)) {
    // Brazil/Portugal format: Street Name, Number or Street Name Number
    // Examples: "Rua das Flores, 123", "Avenida Brasil 456", "Rua Dr. Carlos Halfeld, 50"
    // Should contain at least some letters (street name) and optionally a number
    const hasLetters = /[a-zA-ZÀ-ÿ]/.test(trimmed);
    
    if (!hasLetters) {
      return { 
        valid: false, 
        error: ADDRESS_VALIDATION_ERRORS.INVALID_STREET_FORMAT_STREET_FIRST 
      };
    }
    
    // Valid - street name exists (number is optional as it may be in addressLine2)
    return { valid: true };
  } else {
    // NZ/AU/US/CA/UK format: Number Street Name
    // Examples: "123 Main Street", "45A Queen Road", "1/23 Smith Avenue"
    // Should start with a number or unit format (1/23, 45A, etc.)
    const startsWithNumber = /^[\d]+[A-Za-z]?[\s\/]/.test(trimmed) || /^[\d]+\/[\d]+/.test(trimmed);
    const hasStreetName = /[a-zA-Z]{2,}/.test(trimmed);
    
    if (!startsWithNumber && !hasStreetName) {
      return { 
        valid: false, 
        error: ADDRESS_VALIDATION_ERRORS.INVALID_STREET_FORMAT_NUMBER_FIRST 
      };
    }
    
    // Be lenient - if it has letters, it's likely a valid address
    if (hasStreetName) {
      return { valid: true };
    }
    
    return { valid: true };
  }
};

/**
 * Check if all address fields are empty
 * @param {Object} addressData - Address fields
 * @returns {boolean} True if all fields are empty
 */
export const isAddressEmpty = (addressData) => {
  const { address, city, stateName, zipCode, country } = addressData;
  
  const isEmpty = (val) => !val || val.trim() === "";
  
  return (
    isEmpty(address) &&
    isEmpty(city) &&
    isEmpty(stateName) &&
    isEmpty(zipCode)
  );
};

/**
 * Check if all required address fields are filled
 * @param {Object} addressData - Address fields
 * @returns {boolean} True if all required fields are filled
 */
export const isAddressComplete = (addressData) => {
  const { address, city, stateName, zipCode, country } = addressData;
  
  const isFilled = (val) => val && val.trim().length > 0;
  
  return (
    isFilled(address) &&
    isFilled(city) &&
    isFilled(stateName) &&
    isFilled(zipCode) &&
    isFilled(country)
  );
};

///////////////////////////////////////////////////////////////////////
// ================ GOOGLE API VALIDATION ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Validate address exists using Google Places API
 * @param {Object} addressData - Address fields
 * @returns {Promise<{ valid: boolean, error?: string, suggestions?: Array }>}
 */
export const validateAddressWithGoogle = async (addressData) => {
  const { address, city, stateName, zipCode, country } = addressData;
  
  // Check if Google API is available
  if (!window.google?.maps?.places) {
    console.warn("Google Places API not loaded");
    return { valid: true, warning: "Address validation unavailable" };
  }

  try {
    const countryCode = COUNTRY_NAME_TO_CODE[country] || "nz";
    
    // Build full address string
    const fullAddress = [address, city, stateName, zipCode, country]
      .filter(Boolean)
      .join(", ");

    return new Promise((resolve) => {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      
      autocompleteService.getPlacePredictions(
        {
          input: fullAddress,
          componentRestrictions: { country: countryCode },
          types: ["address"],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
            // Address found - check if it's a close match
            const topPrediction = predictions[0];
            const similarity = calculateAddressSimilarity(fullAddress, topPrediction.description);
            
            if (similarity > 0.5) {
              resolve({ valid: true, matchedAddress: topPrediction.description });
            } else {
              resolve({
                valid: false,
                error: ADDRESS_VALIDATION_ERRORS.ADDRESS_NOT_FOUND,
                suggestions: predictions.slice(0, 3).map(p => p.description),
              });
            }
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve({
              valid: false,
              error: ADDRESS_VALIDATION_ERRORS.ADDRESS_NOT_FOUND,
            });
          } else {
            // API error or other status - allow submission but warn
            console.warn("Google Places API returned status:", status);
            resolve({ valid: true, warning: "Could not verify address" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Google Places validation error:", error);
    return { valid: true, warning: ADDRESS_VALIDATION_ERRORS.GOOGLE_API_ERROR };
  }
};

/**
 * Calculate similarity between two address strings
 * @param {string} addr1 - First address
 * @param {string} addr2 - Second address
 * @returns {number} Similarity score (0-1)
 */
const calculateAddressSimilarity = (addr1, addr2) => {
  const normalize = (str) => 
    str.toLowerCase()
      .replace(/[,.\-\/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  
  const words1 = normalize(addr1).split(" ");
  const words2 = normalize(addr2).split(" ");
  
  let matches = 0;
  words1.forEach(word => {
    if (word.length > 1 && words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  });
  
  return matches / Math.max(words1.length, 1);
};

///////////////////////////////////////////////////////////////////////
// ================ ZOD SCHEMAS ==================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Base address schema with flexible validation
 */
export const addressSchema = z.object({
  address: z.string().optional(),
  addressLine2: z.string().optional(), // Always optional
  city: z.string().optional(),
  stateName: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

/**
 * Strict address schema - all fields required
 */
export const strictAddressSchema = z.object({
  address: z.string().min(3, "Street address must be at least 3 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateName: z.string().min(1, "State/Region is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

///////////////////////////////////////////////////////////////////////
// ================ MAIN VALIDATION FUNCTION ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Comprehensive address validation
 * @param {Object} addressData - Address fields to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.requireComplete - If true, all fields must be filled
 * @param {boolean} options.validateWithGoogle - If true, validate against Google API
 * @param {boolean} options.validateFormat - If true, validate street format by country
 * @returns {Promise<{ success: boolean, error?: string, warnings?: string[] }>}
 */
export const validateAddress = async (addressData, options = {}) => {
  const {
    requireComplete = false,
    validateWithGoogle = false,
    validateFormat = true,
  } = options;

  const { address, addressLine2, city, stateName, zipCode, country } = addressData;
  const warnings = [];

  // ===== 1. Check all-or-nothing rule ===== //
  const isEmpty = isAddressEmpty(addressData);
  const isComplete = isAddressComplete(addressData);

  if (!isEmpty && !isComplete) {
    // Some fields are filled but not all required ones
    const missingFields = [];
    if (!address?.trim()) missingFields.push("street address");
    if (!city?.trim()) missingFields.push("city");
    if (!stateName?.trim()) missingFields.push("state/region");
    if (!zipCode?.trim()) missingFields.push("zip code");
    if (!country?.trim()) missingFields.push("country");
    
    return {
      success: false,
      error: `Please complete the following: ${missingFields.join(", ")}`,
    };
  }

  // If completely empty and not required, that's valid
  if (isEmpty && !requireComplete) {
    return { success: true, warnings };
  }

  // If empty but required, error
  if (isEmpty && requireComplete) {
    return {
      success: false,
      error: "Address is required",
    };
  }

  // ===== 2. Validate street format based on country ===== //
  if (validateFormat && address) {
    const formatResult = validateStreetFormat(address, country || "New Zealand");
    if (!formatResult.valid) {
      // Make this a warning, not an error (allow manual entry)
      warnings.push(formatResult.error);
    }
  }

  // ===== 3. Validate zip code format ===== //
  if (zipCode && country) {
    if (!isValidZipCode(zipCode, country)) {
      const hint = getZipCodeHint(country);
      return {
        success: false,
        error: `Invalid zip code format. ${hint}`,
      };
    }
  }

  // ===== 4. Validate with Google API (optional) ===== //
  if (validateWithGoogle && !isEmpty) {
    const googleResult = await validateAddressWithGoogle(addressData);
    
    if (!googleResult.valid) {
      // Return suggestions if available
      if (googleResult.suggestions?.length > 0) {
        return {
          success: false,
          error: googleResult.error,
          suggestions: googleResult.suggestions,
        };
      }
      return {
        success: false,
        error: googleResult.error,
      };
    }
    
    if (googleResult.warning) {
      warnings.push(googleResult.warning);
    }
  }

  return {
    success: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

/**
 * Quick synchronous validation (no Google API)
 * @param {Object} addressData - Address fields to validate
 * @returns {{ success: boolean, error?: string }}
 */
export const validateAddressSync = (addressData) => {
  const { address, city, stateName, zipCode, country } = addressData;

  // Check all-or-nothing
  const isEmpty = isAddressEmpty(addressData);
  const isComplete = isAddressComplete(addressData);

  if (!isEmpty && !isComplete) {
    const missingFields = [];
    if (!address?.trim()) missingFields.push("street address");
    if (!city?.trim()) missingFields.push("city");
    if (!stateName?.trim()) missingFields.push("state/region");
    if (!zipCode?.trim()) missingFields.push("zip code");
    if (!country?.trim()) missingFields.push("country");
    
    return {
      success: false,
      error: `Please complete: ${missingFields.join(", ")}`,
    };
  }

  // If complete, validate zip code format
  if (isComplete && zipCode && country) {
    if (!isValidZipCode(zipCode, country)) {
      const hint = getZipCodeHint(country);
      return {
        success: false,
        error: `Invalid zip code format. ${hint}`,
      };
    }
  }

  return { success: true };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

export default {
  validateAddress,
  validateAddressSync,
  validateAddressWithGoogle,
  validateStreetFormat,
  isValidZipCode,
  isAddressEmpty,
  isAddressComplete,
  isStreetFirstCountry,
  getZipCodeHint,
  normalizeZipCode,
  normalizeAccents,
  ZIP_CODE_PATTERNS,
  STREET_FIRST_COUNTRIES,
  NUMBER_FIRST_COUNTRIES,
  ADDRESS_VALIDATION_ERRORS,
};
