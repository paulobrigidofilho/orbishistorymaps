///////////////////////////////////////////////////////////////////////
// ================ FREIGHT HELPER ================================= //
///////////////////////////////////////////////////////////////////////

// Frontend helper for freight calculations using the backend API
// Handles address-based freight zone detection and cost calculation

import { FREIGHT_API } from "../constants/addressConstants";

///////////////////////////////////////////////////////////////////////
// ================ API BASE URL =================================== //
///////////////////////////////////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

///////////////////////////////////////////////////////////////////////
// ================ FETCH HELPERS ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Make a fetch request with common configuration
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

///////////////////////////////////////////////////////////////////////
// ================ FREIGHT CALCULATION FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

/**
 * Calculate freight cost from address data
 * Calls backend to detect zone and calculate shipping cost
 * 
 * @param {Object} addressData - Address information
 * @param {string} addressData.country - Country name
 * @param {string} addressData.city - City name
 * @param {string} addressData.state - State/region name
 * @param {string} addressData.postalCode - Postal code
 * @param {string} addressData.formattedAddress - Full formatted address (optional)
 * @param {number} orderTotal - Order subtotal for free freight calculation
 * @returns {Promise<Object>} Freight calculation result
 */
export const calculateFreightFromAddress = async (addressData, orderTotal = 0) => {
  try {
    const response = await fetchAPI(FREIGHT_API.CALCULATE_FROM_ADDRESS, {
      method: "POST",
      body: JSON.stringify({
        country: addressData.country,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        formattedAddress: addressData.formattedAddress,
        orderTotal,
      }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error calculating freight from address:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get freight zones information
 * Returns all zones with costs, supported countries, and thresholds
 * 
 * @returns {Promise<Object>} Zones information
 */
export const getFreightZonesInfo = async () => {
  try {
    const response = await fetchAPI(FREIGHT_API.ZONES_INFO);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching freight zones info:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Validate shipping address
 * 
 * @param {Object} addressData - Address information
 * @returns {Promise<Object>} Validation result
 */
export const validateShippingAddress = async (addressData) => {
  try {
    const response = await fetchAPI(FREIGHT_API.VALIDATE_ADDRESS, {
      method: "POST",
      body: JSON.stringify({
        country: addressData.country,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
      }),
    });

    return {
      success: true,
      isValid: response.isValid,
      errors: response.errors || [],
    };
  } catch (error) {
    return {
      success: false,
      isValid: false,
      errors: [error.message],
    };
  }
};

/**
 * Get supported countries list from backend
 * 
 * @returns {Promise<Object>} Supported countries
 */
export const getSupportedCountries = async () => {
  try {
    const response = await fetchAPI(FREIGHT_API.SUPPORTED_COUNTRIES);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching supported countries:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get freight configuration
 * 
 * @returns {Promise<Object>} Freight configuration
 */
export const getFreightConfig = async () => {
  try {
    const response = await fetchAPI(FREIGHT_API.CONFIG);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching freight config:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

///////////////////////////////////////////////////////////////////////
// ================ UI HELPER FUNCTIONS ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Format currency for display (NZD $XX.XX format like Amazon)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return `NZD $${num.toFixed(2)}`;
};

/**
 * Calculate progress towards free freight
 * @param {number} currentTotal - Current order total
 * @param {number} threshold - Free freight threshold
 * @returns {Object} Progress information
 */
export const calculateFreeFreightProgress = (currentTotal, threshold) => {
  const progress = Math.min((currentTotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - currentTotal, 0);
  const isQualified = currentTotal >= threshold;

  return {
    progress: Math.round(progress),
    remaining,
    isQualified,
    formattedRemaining: formatCurrency(remaining),
    formattedThreshold: formatCurrency(threshold),
  };
};

/**
 * Get shipping message based on freight result
 * @param {Object} freightResult - Result from calculateFreightFromAddress
 * @returns {string} User-friendly shipping message
 */
export const getShippingMessage = (freightResult) => {
  if (!freightResult.success) {
    return "Unable to calculate shipping";
  }

  const { data } = freightResult;

  if (data.isFreeFreight) {
    return `Free shipping! You qualify for free ${data.zoneDisplayName} delivery`;
  }

  if (data.amountForFreeFreight && data.amountForFreeFreight > 0) {
    return `Add ${formatCurrency(data.amountForFreeFreight)} more for free shipping`;
  }

  return `Shipping: ${formatCurrency(data.freightCost)} to ${data.zoneDisplayName}`;
};

/**
 * Get zone color for UI display
 * @param {string} zone - Zone identifier
 * @returns {string} CSS color class or hex color
 */
export const getZoneColor = (zone) => {
  const zoneColors = {
    local: "#4CAF50",           // Green for local
    north_island: "#2196F3",    // Blue for North Island
    south_island: "#03A9F4",    // Light Blue for South Island
    intl_north_america: "#FF9800", // Orange for international
    intl_asia: "#FF5722",       // Deep Orange
    intl_europe: "#9C27B0",     // Purple
    intl_latin_america: "#E91E63", // Pink
  };

  return zoneColors[zone] || "#757575";
};

export default {
  calculateFreightFromAddress,
  getFreightZonesInfo,
  validateShippingAddress,
  getSupportedCountries,
  getFreightConfig,
  formatCurrency,
  calculateFreeFreightProgress,
  getShippingMessage,
  getZoneColor,
};
