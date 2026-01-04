///////////////////////////////////////////////////////////////////////
// ================ ADDRESS CONSTANTS ============================== //
///////////////////////////////////////////////////////////////////////

// Frontend constants for Google Address Autocomplete and freight zones
// These should match the backend constants in zoneDetectionHelper.js

///////////////////////////////////////////////////////////////////////
// ================ SUPPORTED COUNTRIES ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Supported countries for shipping
 * Order: Default (NZ) first, then alphabetical
 */
export const SUPPORTED_COUNTRIES = [
  { code: "NZ", name: "New Zealand", displayName: "🇳🇿 New Zealand" },
  { code: "AU", name: "Australia", displayName: "🇦🇺 Australia" },
  { code: "BR", name: "Brazil", displayName: "🇧🇷 Brazil" },
  { code: "CA", name: "Canada", displayName: "🇨🇦 Canada" },
  { code: "CN", name: "China", displayName: "🇨🇳 China" },
  { code: "PT", name: "Portugal", displayName: "🇵🇹 Portugal" },
  { code: "GB", name: "United Kingdom", displayName: "🇬🇧 United Kingdom" },
  { code: "US", name: "United States", displayName: "🇺🇸 United States" },
];

/**
 * Country codes for Google Places API
 * Used to restrict autocomplete results
 */
export const COUNTRY_CODES = SUPPORTED_COUNTRIES.map((c) => c.code.toLowerCase());

/**
 * Default country for new addresses
 */
export const DEFAULT_COUNTRY = "New Zealand";
export const DEFAULT_COUNTRY_CODE = "nz";

/**
 * Country code to name mapping
 */
export const COUNTRY_CODE_TO_NAME = {
  nz: "New Zealand",
  au: "Australia",
  us: "United States",
  ca: "Canada",
  br: "Brazil",
  pt: "Portugal",
  gb: "United Kingdom",
  cn: "China",
};

/**
 * Country name to code mapping
 */
export const COUNTRY_NAME_TO_CODE = {
  "New Zealand": "nz",
  Australia: "au",
  "United States": "us",
  Canada: "ca",
  Brazil: "br",
  Portugal: "pt",
  "United Kingdom": "gb",
  China: "cn",
};

///////////////////////////////////////////////////////////////////////
// ================ FREIGHT ZONES ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Freight zone identifiers
 */
export const FREIGHT_ZONES = {
  LOCAL: "local",
  NORTH_ISLAND: "north_island",
  SOUTH_ISLAND: "south_island",
  INTL_NORTH_AMERICA: "intl_north_america",
  INTL_ASIA: "intl_asia",
  INTL_EUROPE: "intl_europe",
  INTL_LATIN_AMERICA: "intl_latin_america",
};

/**
 * Freight zone display names
 */
export const ZONE_DISPLAY_NAMES = {
  [FREIGHT_ZONES.LOCAL]: "Local (Tauranga)",
  [FREIGHT_ZONES.NORTH_ISLAND]: "NZ North Island",
  [FREIGHT_ZONES.SOUTH_ISLAND]: "NZ South Island",
  [FREIGHT_ZONES.INTL_NORTH_AMERICA]: "International - North America",
  [FREIGHT_ZONES.INTL_ASIA]: "International - Asia",
  [FREIGHT_ZONES.INTL_EUROPE]: "International - Europe",
  [FREIGHT_ZONES.INTL_LATIN_AMERICA]: "International - Latin America",
};

/**
 * Country to freight zone mapping (for quick reference)
 */
export const COUNTRY_TO_ZONE = {
  "New Zealand": null, // Requires city/region detection
  "United States": FREIGHT_ZONES.INTL_NORTH_AMERICA,
  Canada: FREIGHT_ZONES.INTL_NORTH_AMERICA,
  Brazil: FREIGHT_ZONES.INTL_LATIN_AMERICA,
  Portugal: FREIGHT_ZONES.INTL_EUROPE,
  "United Kingdom": FREIGHT_ZONES.INTL_EUROPE,
  China: FREIGHT_ZONES.INTL_ASIA,
};

/**
 * Zone categories for threshold grouping
 */
export const ZONE_CATEGORIES = {
  LOCAL: "local",
  NATIONAL: "national",
  INTERNATIONAL: "international",
};

/**
 * Map zones to categories for UI grouping
 */
export const ZONE_TO_CATEGORY = {
  [FREIGHT_ZONES.LOCAL]: ZONE_CATEGORIES.LOCAL,
  [FREIGHT_ZONES.NORTH_ISLAND]: ZONE_CATEGORIES.NATIONAL,
  [FREIGHT_ZONES.SOUTH_ISLAND]: ZONE_CATEGORIES.NATIONAL,
  [FREIGHT_ZONES.INTL_NORTH_AMERICA]: ZONE_CATEGORIES.INTERNATIONAL,
  [FREIGHT_ZONES.INTL_ASIA]: ZONE_CATEGORIES.INTERNATIONAL,
  [FREIGHT_ZONES.INTL_EUROPE]: ZONE_CATEGORIES.INTERNATIONAL,
  [FREIGHT_ZONES.INTL_LATIN_AMERICA]: ZONE_CATEGORIES.INTERNATIONAL,
};

///////////////////////////////////////////////////////////////////////
// ================ GOOGLE PLACES CONFIG =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Google Places Autocomplete options
 */
export const AUTOCOMPLETE_OPTIONS = {
  types: ["address"],
  fields: [
    "address_components",
    "formatted_address",
    "geometry",
    "place_id",
    "name",
  ],
};

/**
 * Address component types from Google Places
 */
export const ADDRESS_COMPONENT_TYPES = {
  STREET_NUMBER: "street_number",
  ROUTE: "route",
  LOCALITY: "locality", // City
  SUBLOCALITY: "sublocality", // Suburb
  ADMIN_AREA_1: "administrative_area_level_1", // State/Region
  ADMIN_AREA_2: "administrative_area_level_2", // County/District
  COUNTRY: "country",
  POSTAL_CODE: "postal_code",
};

///////////////////////////////////////////////////////////////////////
// ================ API ENDPOINTS ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Freight API endpoints
 */
export const FREIGHT_API = {
  CALCULATE_FROM_ADDRESS: "/api/freight/calculate-from-address",
  ZONES_INFO: "/api/freight/zones-info",
  VALIDATE_ADDRESS: "/api/freight/validate-address",
  SUPPORTED_COUNTRIES: "/api/freight/supported-countries",
  CONFIG: "/api/freight/config",
};

///////////////////////////////////////////////////////////////////////
// ================ HELPER FUNCTIONS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get country object by code
 * @param {string} code - Country code (e.g., "nz")
 * @returns {Object|undefined} Country object
 */
export const getCountryByCode = (code) => {
  return SUPPORTED_COUNTRIES.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
};

/**
 * Get country object by name
 * @param {string} name - Country name (e.g., "New Zealand")
 * @returns {Object|undefined} Country object
 */
export const getCountryByName = (name) => {
  return SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Check if a country is supported
 * @param {string} countryNameOrCode - Country name or code
 * @returns {boolean} True if supported
 */
export const isCountrySupported = (countryNameOrCode) => {
  return SUPPORTED_COUNTRIES.some(
    (c) =>
      c.code.toLowerCase() === countryNameOrCode.toLowerCase() ||
      c.name.toLowerCase() === countryNameOrCode.toLowerCase()
  );
};

/**
 * Get zone display name
 * @param {string} zone - Zone identifier
 * @returns {string} Display name
 */
export const getZoneDisplayName = (zone) => {
  return ZONE_DISPLAY_NAMES[zone] || "Unknown Zone";
};

/**
 * Get zone category (local, national, international)
 * @param {string} zone - Zone identifier
 * @returns {string} Category
 */
export const getZoneCategory = (zone) => {
  return ZONE_TO_CATEGORY[zone] || ZONE_CATEGORIES.INTERNATIONAL;
};
