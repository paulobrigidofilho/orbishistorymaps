///////////////////////////////////////////////////////////////////////
// ================ ZONE DETECTION HELPER ========================== //
///////////////////////////////////////////////////////////////////////

// This helper handles freight zone detection based on address data
// Supports Local (configurable city), National (NZ North/South Island), and International zones
// Local zone is configurable via FreightConfig (defaults to Tauranga)

///////////////////////////////////////////////////////////////////////
// ================ CONSTANTS ====================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Supported countries for shipping
 * Limited to specific countries for freight calculation
 */
const SUPPORTED_COUNTRIES = [
  "New Zealand",
  "Australia",
  "United States",
  "Canada",
  "Brazil",
  "Portugal",
  "United Kingdom",
  "China",
];

/**
 * Country code mappings for Google Places API
 * Maps common variations to standardized country names
 */
const COUNTRY_CODE_MAP = {
  // New Zealand
  NZ: "New Zealand",
  "new zealand": "New Zealand",
  // Australia
  AU: "Australia",
  australia: "Australia",
  // United States
  US: "United States",
  USA: "United States",
  "united states": "United States",
  "united states of america": "United States",
  // Canada
  CA: "Canada",
  canada: "Canada",
  // Brazil
  BR: "Brazil",
  brazil: "Brazil",
  brasil: "Brazil",
  // Portugal
  PT: "Portugal",
  portugal: "Portugal",
  // United Kingdom
  GB: "United Kingdom",
  UK: "United Kingdom",
  "united kingdom": "United Kingdom",
  "great britain": "United Kingdom",
  england: "United Kingdom",
  scotland: "United Kingdom",
  wales: "United Kingdom",
  // China
  CN: "China",
  china: "China",
  "people's republic of china": "China",
};

/**
 * Freight zone types with descriptions
 */
const FREIGHT_ZONES = {
  LOCAL: "local",                         // Tauranga City only
  NORTH_ISLAND: "north_island",           // NZ North Island (excluding Tauranga)
  SOUTH_ISLAND: "south_island",           // NZ South Island
  INTL_NORTH_AMERICA: "intl_north_america", // USA, Canada
  INTL_ASIA: "intl_asia",                 // China
  INTL_EUROPE: "intl_europe",             // UK, Portugal
  INTL_LATIN_AMERICA: "intl_latin_america", // Brazil
};

/**
 * Country to freight zone mapping
 * Maps each supported country to its freight zone
 */
const COUNTRY_TO_ZONE_MAP = {
  "New Zealand": null,           // Requires further city/region detection
  Australia: FREIGHT_ZONES.INTL_ASIA,
  "United States": FREIGHT_ZONES.INTL_NORTH_AMERICA,
  Canada: FREIGHT_ZONES.INTL_NORTH_AMERICA,
  Brazil: FREIGHT_ZONES.INTL_LATIN_AMERICA,
  Portugal: FREIGHT_ZONES.INTL_EUROPE,
  "United Kingdom": FREIGHT_ZONES.INTL_EUROPE,
  China: FREIGHT_ZONES.INTL_ASIA,
};

/**
 * NZ North Island regions for zone detection
 * Used to distinguish North Island from South Island
 */
const NZ_NORTH_ISLAND_REGIONS = [
  // Main regions
  "Northland",
  "Auckland",
  "Waikato",
  "Bay of Plenty",
  "Gisborne",
  "Hawke's Bay",
  "Hawkes Bay",
  "Taranaki",
  "Manawatu-Wanganui",
  "Manawatu-Whanganui",
  "Wellington",
  // Alternative names and cities that indicate North Island
  "North Island",
  "Hamilton",
  "Tauranga",
  "Rotorua",
  "Napier",
  "Hastings",
  "Palmerston North",
  "Lower Hutt",
  "Upper Hutt",
  "Porirua",
  "New Plymouth",
  "Whangarei",
  "Thames",
  "Taupo",
  "Whakatane",
];

/**
 * NZ South Island regions for zone detection
 * Used to classify South Island addresses
 */
const NZ_SOUTH_ISLAND_REGIONS = [
  // Main regions
  "Tasman",
  "Nelson",
  "Marlborough",
  "West Coast",
  "Canterbury",
  "Otago",
  "Southland",
  // Alternative names and cities that indicate South Island
  "South Island",
  "Christchurch",
  "Dunedin",
  "Queenstown",
  "Invercargill",
  "Nelson City",
  "Blenheim",
  "Timaru",
  "Ashburton",
  "Greymouth",
  "Hokitika",
  "Oamaru",
  "Wanaka",
];

/**
 * Tauranga area identifiers for Local zone detection (DEFAULT)
 * Used when no custom local zone is configured
 * Includes city names, suburbs, and postal codes in Tauranga area
 */
const DEFAULT_LOCAL_ZONE = {
  city: "Tauranga",
  suburbs: [
    "Tauranga",
    "Mount Maunganui",
    "Mt Maunganui",
    "Papamoa",
    "Pāpāmoa",
    "Bethlehem",
    "Otumoetai",
    "Welcome Bay",
    "Greerton",
    "Gate Pa",
    "Tauranga South",
    "Matua",
    "Brookfield",
    "Parkvale",
    "Maungatapu",
  ],
  // Tauranga postal code ranges (3100-3199 series)
  postalCodePrefixes: ["310", "311", "312", "314", "315", "316"],
  // Tauranga region/area identifiers
  region: "Bay of Plenty",
  regionAliases: [
    "Tauranga City",
    "Tauranga District",
    "Western Bay of Plenty",
  ],
};

/**
 * DEPRECATED: Use DEFAULT_LOCAL_ZONE instead
 * Kept for backward compatibility
 */
const TAURANGA_IDENTIFIERS = {
  cities: DEFAULT_LOCAL_ZONE.suburbs,
  postalCodePrefixes: DEFAULT_LOCAL_ZONE.postalCodePrefixes,
  regions: DEFAULT_LOCAL_ZONE.regionAliases,
};

/**
 * NZ cities that can be set as local zone
 * Includes all major cities from both North and South Island
 */
const NZ_NORTH_ISLAND_CITIES = [
  // ===== North Island Cities ===== //
  { city: "Auckland", region: "Auckland", postalPrefixes: ["010", "011", "012", "020", "021", "022", "023", "024", "060", "061", "062"], island: "north" },
  { city: "Wellington", region: "Wellington", postalPrefixes: ["601", "602", "603", "604", "605", "610", "611", "612", "613", "614", "615"], island: "north" },
  { city: "Hamilton", region: "Waikato", postalPrefixes: ["320", "321", "322", "323", "324", "325"], island: "north" },
  { city: "Tauranga", region: "Bay of Plenty", postalPrefixes: ["310", "311", "312", "314", "315", "316"], island: "north" },
  { city: "Rotorua", region: "Bay of Plenty", postalPrefixes: ["301", "302", "303", "304"], island: "north" },
  { city: "Napier", region: "Hawke's Bay", postalPrefixes: ["410", "411", "412", "413"], island: "north" },
  { city: "Hastings", region: "Hawke's Bay", postalPrefixes: ["414", "415", "416", "417", "418"], island: "north" },
  { city: "New Plymouth", region: "Taranaki", postalPrefixes: ["430", "431", "432", "433", "434"], island: "north" },
  { city: "Palmerston North", region: "Manawatu-Wanganui", postalPrefixes: ["440", "441", "442", "443", "444", "445"], island: "north" },
  { city: "Whangarei", region: "Northland", postalPrefixes: ["010", "011", "012", "013", "014"], island: "north" },
  { city: "Gisborne", region: "Gisborne", postalPrefixes: ["401", "402", "403", "404"], island: "north" },
  { city: "Taupo", region: "Waikato", postalPrefixes: ["330", "331", "332", "333"], island: "north" },
  { city: "Whakatane", region: "Bay of Plenty", postalPrefixes: ["307", "308", "309"], island: "north" },
  { city: "Lower Hutt", region: "Wellington", postalPrefixes: ["501", "502", "503", "504", "505"], island: "north" },
  { city: "Upper Hutt", region: "Wellington", postalPrefixes: ["506", "507", "508"], island: "north" },
  { city: "Porirua", region: "Wellington", postalPrefixes: ["504", "505"], island: "north" },
  { city: "Kapiti Coast", region: "Wellington", postalPrefixes: ["500", "501"], island: "north" },
  { city: "Whanganui", region: "Manawatu-Wanganui", postalPrefixes: ["450", "451", "452"], island: "north" },
  { city: "Levin", region: "Manawatu-Wanganui", postalPrefixes: ["550", "551"], island: "north" },
  { city: "Masterton", region: "Wellington", postalPrefixes: ["580", "581", "582"], island: "north" },
  { city: "Cambridge", region: "Waikato", postalPrefixes: ["341", "342", "343"], island: "north" },
  { city: "Te Awamutu", region: "Waikato", postalPrefixes: ["380", "381"], island: "north" },
  { city: "Tokoroa", region: "Waikato", postalPrefixes: ["342", "343"], island: "north" },
  { city: "Thames", region: "Waikato", postalPrefixes: ["350", "351", "352"], island: "north" },
  { city: "Waihi", region: "Waikato", postalPrefixes: ["361", "362"], island: "north" },
  { city: "Kerikeri", region: "Northland", postalPrefixes: ["020", "021", "022"], island: "north" },
  { city: "Kaitaia", region: "Northland", postalPrefixes: ["040", "041", "042"], island: "north" },
  // ===== South Island Cities ===== //
  { city: "Christchurch", region: "Canterbury", postalPrefixes: ["800", "801", "802", "803", "804", "805", "806", "807", "808", "809", "810", "811", "812", "813", "814", "815", "816", "817", "818", "819", "820", "821", "822", "823", "824", "825", "826"], island: "south" },
  { city: "Dunedin", region: "Otago", postalPrefixes: ["901", "902", "903", "904", "905", "906", "907", "908", "909", "910", "911", "912", "913", "914", "915", "916", "917", "918", "919", "920", "921", "922", "923", "924", "925", "926", "927"], island: "south" },
  { city: "Queenstown", region: "Otago", postalPrefixes: ["930", "931", "932", "933"], island: "south" },
  { city: "Invercargill", region: "Southland", postalPrefixes: ["981", "982", "983", "984", "985", "986", "987", "988", "989", "990", "991", "992", "993", "994", "995", "996", "997", "998"], island: "south" },
  { city: "Nelson", region: "Nelson", postalPrefixes: ["700", "701", "702", "703", "704", "705", "706", "707", "708", "709", "710", "711", "712", "713", "714", "715", "716"], island: "south" },
  { city: "Blenheim", region: "Marlborough", postalPrefixes: ["720", "721", "722", "723", "724", "725", "726"], island: "south" },
  { city: "Timaru", region: "Canterbury", postalPrefixes: ["790", "791", "792", "793", "794", "795", "796", "797", "798", "799"], island: "south" },
  { city: "Ashburton", region: "Canterbury", postalPrefixes: ["770", "771", "772", "773", "774", "775", "776", "777", "778", "779"], island: "south" },
  { city: "Oamaru", region: "Otago", postalPrefixes: ["940", "941", "942", "943", "944", "945"], island: "south" },
  { city: "Greymouth", region: "West Coast", postalPrefixes: ["770", "771", "772"], island: "south" },
  { city: "Hokitika", region: "West Coast", postalPrefixes: ["780", "781", "782"], island: "south" },
  { city: "Wanaka", region: "Otago", postalPrefixes: ["930", "931"], island: "south" },
  { city: "Alexandra", region: "Otago", postalPrefixes: ["930", "931", "932"], island: "south" },
  { city: "Gore", region: "Southland", postalPrefixes: ["970", "971", "972"], island: "south" },
  { city: "Rangiora", region: "Canterbury", postalPrefixes: ["743", "744", "745"], island: "south" },
  { city: "Rolleston", region: "Canterbury", postalPrefixes: ["755", "756"], island: "south" },
  { city: "Motueka", region: "Tasman", postalPrefixes: ["710", "711", "712"], island: "south" },
  { city: "Richmond", region: "Tasman", postalPrefixes: ["700", "701"], island: "south" },
];

///////////////////////////////////////////////////////////////////////
// ================ HELPER FUNCTIONS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Normalize country name to standard format
 * @param {string} country - Raw country name or code
 * @returns {string|null} Normalized country name or null if not supported
 */
const normalizeCountry = (country) => {
  if (!country) return null;

  const normalized = country.trim();
  
  // Check direct match first
  if (SUPPORTED_COUNTRIES.includes(normalized)) {
    return normalized;
  }

  // Check country code map (case-insensitive)
  const lowercased = normalized.toLowerCase();
  const mapped = COUNTRY_CODE_MAP[normalized] || COUNTRY_CODE_MAP[lowercased];
  
  if (mapped && SUPPORTED_COUNTRIES.includes(mapped)) {
    return mapped;
  }

  return null;
};

/**
 * Check if an address is within the configured local zone
 * @param {Object} addressData - Address data object
 * @param {string} addressData.city - City name
 * @param {string} addressData.postalCode - Postal code
 * @param {string} addressData.state - State/region name
 * @param {string} addressData.formattedAddress - Full formatted address
 * @param {Object} localZoneConfig - Local zone configuration (optional)
 * @param {string} localZoneConfig.city - Local zone city name
 * @param {string} localZoneConfig.region - Local zone region
 * @param {string[]} localZoneConfig.postalCodePrefixes - Array of postal prefixes
 * @param {string[]} localZoneConfig.suburbs - Array of suburb names
 * @returns {boolean} True if address is in the local zone
 */
const isLocalZoneAddress = (addressData, localZoneConfig = null) => {
  const { city, postalCode, state, formattedAddress } = addressData;
  
  // Use provided config or default to Tauranga
  const config = localZoneConfig || {
    city: DEFAULT_LOCAL_ZONE.city,
    suburbs: DEFAULT_LOCAL_ZONE.suburbs,
    postalCodePrefixes: DEFAULT_LOCAL_ZONE.postalCodePrefixes,
    region: DEFAULT_LOCAL_ZONE.region,
    regionAliases: DEFAULT_LOCAL_ZONE.regionAliases,
  };

  // Build list of city/suburb names to check
  const cityNames = [config.city, ...(config.suburbs || [])];
  
  // Build region aliases
  const regionNames = [
    config.region,
    `${config.city} City`,
    `${config.city} District`,
    ...(config.regionAliases || []),
  ].filter(Boolean);

  // Check city name against local zone identifiers
  if (city) {
    const cityLower = city.toLowerCase();
    const isLocalCity = cityNames.some(
      (tc) => cityLower.includes(tc.toLowerCase())
    );
    if (isLocalCity) return true;
  }

  // Check postal code prefix
  if (postalCode && config.postalCodePrefixes && config.postalCodePrefixes.length > 0) {
    const postalPrefix = postalCode.substring(0, 3);
    if (config.postalCodePrefixes.includes(postalPrefix)) {
      return true;
    }
  }

  // Check region/state
  if (state) {
    const stateLower = state.toLowerCase();
    const isLocalRegion = regionNames.some(
      (tr) => stateLower.includes(tr.toLowerCase())
    );
    if (isLocalRegion) return true;
  }

  // Check formatted address as fallback
  if (formattedAddress) {
    const addressLower = formattedAddress.toLowerCase();
    const containsLocal = cityNames.some(
      (tc) => addressLower.includes(tc.toLowerCase())
    );
    if (containsLocal) return true;
  }

  return false;
};

/**
 * DEPRECATED: Use isLocalZoneAddress instead
 * Check if an address is within Tauranga City (Local zone)
 * Kept for backward compatibility
 */
const isTaurangaAddress = (addressData) => {
  return isLocalZoneAddress(addressData, null);
};

/**
 * Determine if a NZ address is on North or South Island
 * @param {Object} addressData - Address data object
 * @param {string} addressData.state - State/region name
 * @param {string} addressData.city - City name
 * @param {string} addressData.formattedAddress - Full formatted address
 * @returns {string} Either "north_island" or "south_island"
 */
const getNZIsland = (addressData) => {
  const { state, city, formattedAddress } = addressData;

  // Check state/region first (most reliable)
  if (state) {
    const stateLower = state.toLowerCase();
    
    // Check North Island regions
    const isNorthIsland = NZ_NORTH_ISLAND_REGIONS.some(
      (region) => stateLower.includes(region.toLowerCase())
    );
    if (isNorthIsland) return FREIGHT_ZONES.NORTH_ISLAND;

    // Check South Island regions
    const isSouthIsland = NZ_SOUTH_ISLAND_REGIONS.some(
      (region) => stateLower.includes(region.toLowerCase())
    );
    if (isSouthIsland) return FREIGHT_ZONES.SOUTH_ISLAND;
  }

  // Check city as fallback
  if (city) {
    const cityLower = city.toLowerCase();

    const isNorthIslandCity = NZ_NORTH_ISLAND_REGIONS.some(
      (region) => cityLower.includes(region.toLowerCase())
    );
    if (isNorthIslandCity) return FREIGHT_ZONES.NORTH_ISLAND;

    const isSouthIslandCity = NZ_SOUTH_ISLAND_REGIONS.some(
      (region) => cityLower.includes(region.toLowerCase())
    );
    if (isSouthIslandCity) return FREIGHT_ZONES.SOUTH_ISLAND;
  }

  // Check formatted address as last resort
  if (formattedAddress) {
    const addressLower = formattedAddress.toLowerCase();

    if (addressLower.includes("south island")) {
      return FREIGHT_ZONES.SOUTH_ISLAND;
    }
    if (addressLower.includes("north island")) {
      return FREIGHT_ZONES.NORTH_ISLAND;
    }
  }

  // Default to North Island if unable to determine
  return FREIGHT_ZONES.NORTH_ISLAND;
};

///////////////////////////////////////////////////////////////////////
// ================ MAIN DETECTION FUNCTION ======================== //
///////////////////////////////////////////////////////////////////////

/**
 * Detect freight zone based on address data
 * @param {Object} addressData - Address data object
 * @param {string} addressData.country - Country name
 * @param {string} addressData.city - City name
 * @param {string} addressData.state - State/region name
 * @param {string} addressData.postalCode - Postal code
 * @param {string} addressData.formattedAddress - Full formatted address (optional)
 * @param {Object} localZoneConfig - Local zone configuration (optional)
 * @param {string} localZoneConfig.city - Local zone city name
 * @param {string} localZoneConfig.region - Local zone region
 * @param {string[]} localZoneConfig.postalCodePrefixes - Array of postal prefixes
 * @param {string[]} localZoneConfig.suburbs - Array of suburb names
 * @returns {Object} Zone detection result
 */
const detectFreightZone = (addressData, localZoneConfig = null) => {
  const { country, city, state, postalCode, formattedAddress } = addressData;

  // Normalize country
  const normalizedCountry = normalizeCountry(country);

  // Check if country is supported
  if (!normalizedCountry) {
    return {
      success: false,
      zone: null,
      isLocal: false,
      isTauranga: false,
      country: null,
      error: `Country "${country}" is not supported for shipping`,
      supportedCountries: SUPPORTED_COUNTRIES,
    };
  }

  // For international destinations, return mapped zone directly
  if (normalizedCountry !== "New Zealand") {
    const zone = COUNTRY_TO_ZONE_MAP[normalizedCountry];
    return {
      success: true,
      zone,
      isLocal: false,
      isTauranga: false,
      country: normalizedCountry,
      isInternational: true,
    };
  }

  // For New Zealand, determine local vs national zone
  const localCheck = isLocalZoneAddress({
    city,
    postalCode,
    state,
    formattedAddress,
  }, localZoneConfig);

  // Get current local zone city name for response
  const localZoneCity = localZoneConfig?.city || DEFAULT_LOCAL_ZONE.city;

  if (localCheck) {
    return {
      success: true,
      zone: FREIGHT_ZONES.LOCAL,
      isLocal: true,
      isTauranga: localZoneCity === "Tauranga",
      localZoneCity,
      country: normalizedCountry,
      isInternational: false,
    };
  }

  // Determine North or South Island
  const island = getNZIsland({ state, city, formattedAddress });

  return {
    success: true,
    zone: island,
    isLocal: false,
    isTauranga: false,
    localZoneCity,
    country: normalizedCountry,
    isInternational: false,
    isNorthIsland: island === FREIGHT_ZONES.NORTH_ISLAND,
    isSouthIsland: island === FREIGHT_ZONES.SOUTH_ISLAND,
  };
};

/**
 * Validate if a country is supported for shipping
 * @param {string} country - Country name to validate
 * @returns {boolean} True if country is supported
 */
const isCountrySupported = (country) => {
  return normalizeCountry(country) !== null;
};

/**
 * Get zone display name for UI
 * @param {string} zone - Zone identifier
 * @param {string} localZoneCity - Local zone city name (optional)
 * @returns {string} Human-readable zone name
 */
const getZoneDisplayName = (zone, localZoneCity = "Tauranga") => {
  const displayNames = {
    [FREIGHT_ZONES.LOCAL]: `Local (${localZoneCity})`,
    [FREIGHT_ZONES.NORTH_ISLAND]: "NZ North Island",
    [FREIGHT_ZONES.SOUTH_ISLAND]: "NZ South Island",
    [FREIGHT_ZONES.INTL_NORTH_AMERICA]: "International - North America",
    [FREIGHT_ZONES.INTL_ASIA]: "International - Asia",
    [FREIGHT_ZONES.INTL_EUROPE]: "International - Europe",
    [FREIGHT_ZONES.INTL_LATIN_AMERICA]: "International - Latin America",
  };

  return displayNames[zone] || "Unknown Zone";
};

/**
 * Parse local zone config from FreightConfig model
 * @param {Object} freightConfig - FreightConfig model instance or plain object
 * @returns {Object} Parsed local zone configuration
 */
const parseLocalZoneConfig = (freightConfig) => {
  if (!freightConfig) return null;
  
  const city = freightConfig.local_zone_city || DEFAULT_LOCAL_ZONE.city;
  const region = freightConfig.local_zone_region || DEFAULT_LOCAL_ZONE.region;
  
  // Parse postal prefixes from comma-separated string
  const postalCodePrefixes = freightConfig.local_zone_postal_prefixes
    ? freightConfig.local_zone_postal_prefixes.split(",").map(p => p.trim())
    : DEFAULT_LOCAL_ZONE.postalCodePrefixes;
  
  // Parse suburbs from comma-separated string
  const suburbs = freightConfig.local_zone_suburbs
    ? freightConfig.local_zone_suburbs.split(",").map(s => s.trim())
    : DEFAULT_LOCAL_ZONE.suburbs;

  return {
    city,
    region,
    postalCodePrefixes,
    suburbs,
    regionAliases: [
      `${city} City`,
      `${city} District`,
    ],
  };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  // Constants
  SUPPORTED_COUNTRIES,
  FREIGHT_ZONES,
  COUNTRY_TO_ZONE_MAP,
  NZ_NORTH_ISLAND_REGIONS,
  NZ_SOUTH_ISLAND_REGIONS,
  TAURANGA_IDENTIFIERS,
  DEFAULT_LOCAL_ZONE,
  NZ_NORTH_ISLAND_CITIES,
  
  // Functions
  detectFreightZone,
  normalizeCountry,
  isTaurangaAddress,
  isLocalZoneAddress,
  getNZIsland,
  isCountrySupported,
  getZoneDisplayName,
  parseLocalZoneConfig,
};
