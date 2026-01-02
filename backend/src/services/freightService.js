///////////////////////////////////////////////////////////////////////
// ================ FREIGHT SERVICE ================================ //
///////////////////////////////////////////////////////////////////////

// This service handles freight configuration business logic
// Including default calculations, validation, and zone detection

const { FreightConfig } = require("../models");
const {
  detectFreightZone,
  SUPPORTED_COUNTRIES,
  FREIGHT_ZONES,
  getZoneDisplayName,
  isCountrySupported,
  parseLocalZoneConfig,
  NZ_NORTH_ISLAND_CITIES,
} = require("../helpers/zoneDetectionHelper");

///////////////////////////////////////////////////////////////////////
// ================ HELPER FUNCTIONS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Calculate default freight costs based on local rate
 * @param {number} localRate - The base local freight rate
 * @returns {Object} Calculated default rates for all zones
 */
const calculateDefaults = (localRate) => {
  const local = parseFloat(localRate);
  
  return {
    north_island: parseFloat((local * 1.05).toFixed(2)),
    south_island: parseFloat((local * 1.08).toFixed(2)),
    intl_asia: parseFloat((local * 1.15).toFixed(2)),
    intl_north_america: parseFloat((local * 1.25).toFixed(2)),
    intl_europe: parseFloat((local * 1.25).toFixed(2)),
    intl_africa: parseFloat((local * 1.25).toFixed(2)),
    intl_latin_america: parseFloat((local * 1.25).toFixed(2)),
  };
};

/**
 * Apply default values to freight data if fields are empty
 * @param {Object} data - The freight data to process
 * @returns {Object} Processed data with defaults applied
 */
const applyDefaults = (data) => {
  const local = parseFloat(data.local);
  
  if (isNaN(local) || local <= 0) {
    throw new Error("Local freight cost is required and must be a positive number");
  }

  const defaults = calculateDefaults(local);
  
  return {
    local,
    north_island: data.north_island ? parseFloat(data.north_island) : defaults.north_island,
    south_island: data.south_island ? parseFloat(data.south_island) : defaults.south_island,
    intl_asia: data.intl_asia ? parseFloat(data.intl_asia) : defaults.intl_asia,
    intl_north_america: data.intl_north_america ? parseFloat(data.intl_north_america) : defaults.intl_north_america,
    intl_europe: data.intl_europe ? parseFloat(data.intl_europe) : defaults.intl_europe,
    intl_africa: data.intl_africa ? parseFloat(data.intl_africa) : defaults.intl_africa,
    intl_latin_america: data.intl_latin_america ? parseFloat(data.intl_latin_america) : defaults.intl_latin_america,
    is_free_freight_enabled: Boolean(data.is_free_freight_enabled),
    threshold_local: data.threshold_local ? parseFloat(data.threshold_local) : 200.00,
    threshold_national: data.threshold_national ? parseFloat(data.threshold_national) : 300.00,
    threshold_international: data.threshold_international ? parseFloat(data.threshold_international) : 500.00,
  };
};

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get current freight configuration
 */
const getFreightConfig = async () => {
  try {
    const config = await FreightConfig.getConfig();
    return config.toJSON();
  } catch (error) {
    console.error("Error getting freight config:", error);
    throw error;
  }
};

/**
 * Update freight configuration
 * @param {Object} data - The configuration data to update
 */
const updateFreightConfig = async (data) => {
  try {
    // Log incoming data for debugging
    console.log("[FreightService] Updating freight config with data:", JSON.stringify(data, null, 2));
    
    // Apply defaults for empty fields
    const processedData = applyDefaults(data);
    console.log("[FreightService] Processed data:", JSON.stringify(processedData, null, 2));
    
    // Update configuration
    const config = await FreightConfig.updateConfig(processedData);
    console.log("[FreightService] Updated config:", JSON.stringify(config.toJSON(), null, 2));
    
    return config.toJSON();
  } catch (error) {
    console.error("Error updating freight config:", error);
    throw error;
  }
};

/**
 * Calculate freight cost for an order
 * @param {string} zone - The delivery zone
 * @param {number} orderTotal - The order subtotal
 * @returns {Object} Freight cost details
 */
const calculateFreightCost = async (zone, orderTotal) => {
  try {
    const config = await FreightConfig.getConfig();
    const freightCost = config.getFreightCost(zone, orderTotal);
    
    // Determine if free freight was applied
    const isFreeFreight = config.is_free_freight_enabled && freightCost === 0;
    
    return {
      zone,
      cost: freightCost,
      isFreeFreight,
      freeFreightEnabled: config.is_free_freight_enabled,
    };
  } catch (error) {
    console.error("Error calculating freight cost:", error);
    throw error;
  }
};

/**
 * Get all available zones with their costs
 */
const getAllZoneCosts = async () => {
  try {
    const config = await FreightConfig.getConfig();
    
    return {
      local: parseFloat(config.local) || 0,
      north_island: parseFloat(config.north_island) || 0,
      south_island: parseFloat(config.south_island) || 0,
      intl_north_america: parseFloat(config.intl_north_america) || 0,
      intl_asia: parseFloat(config.intl_asia) || 0,
      intl_europe: parseFloat(config.intl_europe) || 0,
      intl_africa: parseFloat(config.intl_africa) || 0,
      intl_latin_america: parseFloat(config.intl_latin_america) || 0,
    };
  } catch (error) {
    console.error("Error getting zone costs:", error);
    throw error;
  }
};

/**
 * Calculate freight cost from address data
 * Detects zone automatically based on address and calculates cost
 * @param {Object} addressData - Address data from Google Places or manual input
 * @param {string} addressData.country - Country name
 * @param {string} addressData.city - City name
 * @param {string} addressData.state - State/region name
 * @param {string} addressData.postalCode - Postal code
 * @param {string} addressData.formattedAddress - Full formatted address (optional)
 * @param {number} orderTotal - Order subtotal for free freight calculation
 * @returns {Object} Zone detection and freight cost details
 */
const calculateFreightFromAddress = async (addressData, orderTotal = 0) => {
  try {
    // Get freight config first to get local zone settings
    const config = await FreightConfig.getConfig();
    
    // Parse local zone configuration
    const localZoneConfig = parseLocalZoneConfig(config);
    const localZoneCity = localZoneConfig?.city || "Tauranga";

    // Detect freight zone from address using configured local zone
    const zoneResult = detectFreightZone(addressData, localZoneConfig);

    if (!zoneResult.success) {
      return {
        success: false,
        error: zoneResult.error,
        supportedCountries: SUPPORTED_COUNTRIES,
      };
    }
    
    // Calculate freight cost
    const freightCost = config.getFreightCost(zoneResult.zone, orderTotal);
    
    // Determine zone category for threshold checking
    let zoneCategory;
    if (zoneResult.isLocal) {
      zoneCategory = "local";
    } else if (zoneResult.isInternational) {
      zoneCategory = "international";
    } else {
      zoneCategory = "national";
    }

    // Get the applicable threshold
    const thresholdMap = {
      local: parseFloat(config.threshold_local) || 200,
      national: parseFloat(config.threshold_national) || 300,
      international: parseFloat(config.threshold_international) || 500,
    };
    const threshold = thresholdMap[zoneCategory];

    // Check if free freight applies
    const isFreeFreight = config.is_free_freight_enabled && 
                          parseFloat(orderTotal) >= threshold;

    // Calculate amount needed for free freight
    const amountForFreeFreight = config.is_free_freight_enabled
      ? Math.max(0, threshold - parseFloat(orderTotal))
      : null;

    return {
      success: true,
      zone: zoneResult.zone,
      zoneDisplayName: getZoneDisplayName(zoneResult.zone, localZoneCity),
      zoneCategory,
      country: zoneResult.country,
      isLocal: zoneResult.isLocal || false,
      isTauranga: zoneResult.isTauranga || false,
      localZoneCity,
      isInternational: zoneResult.isInternational || false,
      isNorthIsland: zoneResult.isNorthIsland || false,
      isSouthIsland: zoneResult.isSouthIsland || false,
      freightCost: isFreeFreight ? 0 : freightCost,
      originalFreightCost: freightCost,
      isFreeFreight,
      freeFreightEnabled: config.is_free_freight_enabled,
      threshold,
      amountForFreeFreight,
      orderTotal: parseFloat(orderTotal),
    };
  } catch (error) {
    console.error("Error calculating freight from address:", error);
    throw error;
  }
};

/**
 * Get freight zones and thresholds for display
 * Used by frontend to show shipping options
 */
const getFreightZonesInfo = async () => {
  try {
    const config = await FreightConfig.getConfig();
    const zoneCosts = await getAllZoneCosts();
    
    // Get local zone city name
    const localZoneCity = config.local_zone_city || "Tauranga";

    return {
      zones: Object.entries(FREIGHT_ZONES).map(([key, value]) => ({
        key,
        value,
        displayName: getZoneDisplayName(value, localZoneCity),
        cost: zoneCosts[value] || 0,
      })),
      supportedCountries: SUPPORTED_COUNTRIES,
      freeFreightEnabled: config.is_free_freight_enabled,
      thresholds: {
        local: parseFloat(config.threshold_local) || 200,
        national: parseFloat(config.threshold_national) || 300,
        international: parseFloat(config.threshold_international) || 500,
      },
      localZone: {
        city: localZoneCity,
        region: config.local_zone_region || "Bay of Plenty",
        postalPrefixes: config.local_zone_postal_prefixes || "310,311,312,314,315,316",
        suburbs: config.local_zone_suburbs || "",
      },
    };
  } catch (error) {
    console.error("Error getting freight zones info:", error);
    throw error;
  }
};

/**
 * Validate shipping address for freight calculation
 * @param {Object} addressData - Address data to validate
 * @returns {Object} Validation result
 */
const validateShippingAddress = (addressData) => {
  const { country, city, state, postalCode } = addressData;

  const errors = [];

  // Country is required
  if (!country) {
    errors.push("Country is required");
  } else if (!isCountrySupported(country)) {
    errors.push(`Country "${country}" is not supported for shipping. Supported countries: ${SUPPORTED_COUNTRIES.join(", ")}`);
  }

  // For NZ addresses, we need city or state to determine zone
  if (country && isCountrySupported(country)) {
    const zoneResult = detectFreightZone(addressData);
    if (zoneResult.country === "New Zealand" && !city && !state && !postalCode) {
      errors.push("City, state, or postal code is required for New Zealand addresses");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get local zone configuration
 * Returns current local zone settings
 */
const getLocalZoneConfig = async () => {
  try {
    const config = await FreightConfig.getConfig();
    return {
      city: config.local_zone_city || "Tauranga",
      region: config.local_zone_region || "Bay of Plenty",
      postalPrefixes: config.local_zone_postal_prefixes || "310,311,312,314,315,316",
      suburbs: config.local_zone_suburbs || "",
      availableCities: NZ_NORTH_ISLAND_CITIES,
    };
  } catch (error) {
    console.error("Error getting local zone config:", error);
    throw error;
  }
};

/**
 * Update local zone configuration
 * @param {Object} data - New local zone settings
 * @param {string} data.city - City name
 * @param {string} data.region - Region/state name
 * @param {string} data.postalPrefixes - Comma-separated postal prefixes
 * @param {string} data.suburbs - Comma-separated suburb names
 */
const updateLocalZoneConfig = async (data) => {
  try {
    const { city, region, postalPrefixes, suburbs } = data;

    // Validate that the city is from North Island
    const validCity = NZ_NORTH_ISLAND_CITIES.find(
      c => c.city.toLowerCase() === city.toLowerCase()
    );

    if (!validCity) {
      throw new Error(`City "${city}" is not a valid North Island city. Only North Island cities can be set as local zone.`);
    }

    // Update the config
    const config = await FreightConfig.getConfig();
    await config.update({
      local_zone_city: validCity.city,
      local_zone_region: region || validCity.region,
      local_zone_postal_prefixes: postalPrefixes || validCity.postalPrefixes.join(","),
      local_zone_suburbs: suburbs || "",
    });

    return {
      city: config.local_zone_city,
      region: config.local_zone_region,
      postalPrefixes: config.local_zone_postal_prefixes,
      suburbs: config.local_zone_suburbs,
    };
  } catch (error) {
    console.error("Error updating local zone config:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getFreightConfig,
  updateFreightConfig,
  calculateFreightCost,
  getAllZoneCosts,
  calculateDefaults,
  applyDefaults,
  // New address-based functions
  calculateFreightFromAddress,
  getFreightZonesInfo,
  validateShippingAddress,
  // Local zone configuration
  getLocalZoneConfig,
  updateLocalZoneConfig,
  // Re-export constants for convenience
  SUPPORTED_COUNTRIES,
  FREIGHT_ZONES,
  NZ_NORTH_ISLAND_CITIES,
};
