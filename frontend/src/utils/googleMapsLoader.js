///////////////////////////////////////////////////////////////////////
// ================ GOOGLE MAPS LOADER UTILITY ===================== //
///////////////////////////////////////////////////////////////////////

// Utility to dynamically load the Google Maps JavaScript API
// This ensures the API is loaded only once and provides a promise-based interface

/**
 * Configuration for Google Maps API
 */
const GOOGLE_MAPS_CONFIG = {
  // API key should be set in environment variables (VITE_GOOGLE_MAPS_API_KEY)
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places"],
  version: "weekly",
  language: "en",
  region: "NZ",
};

/**
 * Track loading state
 */
let isLoading = false;
let isLoaded = false;
let loadPromise = null;

/**
 * Load Google Maps API script dynamically
 * @returns {Promise<void>} Resolves when the API is loaded
 */
export const loadGoogleMapsApi = () => {
  // If already loaded, return immediately
  if (isLoaded && window.google?.maps?.places) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Check if API key is configured
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    console.warn(
      "Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY in your .env file."
    );
    return Promise.reject(new Error("Google Maps API key not configured"));
  }

  // Start loading
  isLoading = true;

  loadPromise = new Promise((resolve, reject) => {
    // Check if script is already in the DOM
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener("load", () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      });
      existingScript.addEventListener("error", () => {
        isLoading = false;
        reject(new Error("Failed to load Google Maps API"));
      });
      return;
    }

    // Create callback function name
    const callbackName = `googleMapsCallback_${Date.now()}`;

    // Set up callback
    window[callbackName] = () => {
      isLoaded = true;
      isLoading = false;
      delete window[callbackName];
      resolve();
    };

    // Build the script URL
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_CONFIG.apiKey,
      libraries: GOOGLE_MAPS_CONFIG.libraries.join(","),
      v: GOOGLE_MAPS_CONFIG.version,
      language: GOOGLE_MAPS_CONFIG.language,
      region: GOOGLE_MAPS_CONFIG.region,
      callback: callbackName,
    });

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

    // Create and append script element
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      delete window[callbackName];
      reject(new Error("Failed to load Google Maps API script"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Check if Google Maps API is loaded
 * @returns {boolean}
 */
export const isGoogleMapsLoaded = () => {
  return isLoaded && window.google?.maps?.places;
};

/**
 * Get the Google Maps API key status
 * @returns {Object} Status object with isConfigured and masked key
 */
export const getApiKeyStatus = () => {
  const key = GOOGLE_MAPS_CONFIG.apiKey;
  return {
    isConfigured: !!key,
    maskedKey: key ? `${key.substring(0, 8)}...${key.substring(key.length - 4)}` : "Not configured",
  };
};

export default {
  loadGoogleMapsApi,
  isGoogleMapsLoaded,
  getApiKeyStatus,
};
