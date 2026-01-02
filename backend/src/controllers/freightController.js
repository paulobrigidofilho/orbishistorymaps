///////////////////////////////////////////////////////////////////////
// ================ FREIGHT CONTROLLER ============================= //
///////////////////////////////////////////////////////////////////////

// This controller handles freight configuration HTTP requests

const freightService = require("../services/freightService");
const { handleServerError } = require("../helpers/handleServerError");

///////////////////////////////////////////////////////////////////////
// ================ CONTROLLER FUNCTIONS =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get current freight configuration
 * GET /api/admin/freight
 */
const getFreightConfig = async (req, res) => {
  try {
    const config = await freightService.getFreightConfig();
    
    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching freight configuration");
  }
};

/**
 * Update freight configuration
 * PUT /api/admin/freight
 */
const updateFreightConfig = async (req, res) => {
  try {
    const config = await freightService.updateFreightConfig(req.body);
    
    return res.status(200).json({
      success: true,
      message: "Freight configuration updated successfully",
      data: config,
    });
  } catch (error) {
    // Handle validation errors
    if (error.message.includes("required") || error.message.includes("must be")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return handleServerError(res, error, "Error updating freight configuration");
  }
};

/**
 * Calculate freight cost for checkout
 * POST /api/freight/calculate
 */
const calculateFreightCost = async (req, res) => {
  try {
    const { zone, orderTotal } = req.body;
    
    if (!zone) {
      return res.status(400).json({
        success: false,
        message: "Zone is required",
      });
    }
    
    const result = await freightService.calculateFreightCost(zone, orderTotal || 0);
    
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleServerError(res, error, "Error calculating freight cost");
  }
};

/**
 * Get all zone costs (public endpoint for checkout)
 * GET /api/freight/zones
 */
const getZoneCosts = async (req, res) => {
  try {
    const costs = await freightService.getAllZoneCosts();
    
    return res.status(200).json({
      success: true,
      data: costs,
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching zone costs");
  }
};

/**
 * Get freight configuration (public - for checkout)
 * GET /api/freight/config
 */
const getPublicFreightConfig = async (req, res) => {
  try {
    const config = await freightService.getFreightConfig();
    
    // Return only necessary fields for frontend
    return res.status(200).json({
      success: true,
      data: {
        local: parseFloat(config.local),
        north_island: parseFloat(config.north_island),
        south_island: parseFloat(config.south_island),
        intl_north_america: parseFloat(config.intl_north_america),
        intl_asia: parseFloat(config.intl_asia),
        intl_europe: parseFloat(config.intl_europe),
        intl_africa: parseFloat(config.intl_africa),
        intl_latin_america: parseFloat(config.intl_latin_america),
        is_free_freight_enabled: config.is_free_freight_enabled,
        threshold_local: parseFloat(config.threshold_local),
        threshold_national: parseFloat(config.threshold_national),
        threshold_international: parseFloat(config.threshold_international),
      },
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching freight configuration");
  }
};

/**
 * Calculate freight cost from address data
 * POST /api/freight/calculate-from-address
 * Body: { country, city, state, postalCode, formattedAddress, orderTotal }
 */
const calculateFreightFromAddress = async (req, res) => {
  try {
    const { country, city, state, postalCode, formattedAddress, orderTotal } = req.body;

    // Validate address data
    const validation = freightService.validateShippingAddress({
      country,
      city,
      state,
      postalCode,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address",
        errors: validation.errors,
      });
    }

    // Calculate freight from address
    const result = await freightService.calculateFreightFromAddress(
      { country, city, state, postalCode, formattedAddress },
      orderTotal || 0
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
        supportedCountries: result.supportedCountries,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleServerError(res, error, "Error calculating freight from address");
  }
};

/**
 * Get freight zones information (public endpoint)
 * GET /api/freight/zones-info
 * Returns zones, supported countries, and thresholds
 */
const getFreightZonesInfo = async (req, res) => {
  try {
    const zonesInfo = await freightService.getFreightZonesInfo();

    return res.status(200).json({
      success: true,
      data: zonesInfo,
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching freight zones info");
  }
};

/**
 * Validate shipping address
 * POST /api/freight/validate-address
 * Body: { country, city, state, postalCode }
 */
const validateShippingAddress = async (req, res) => {
  try {
    const { country, city, state, postalCode } = req.body;

    const validation = freightService.validateShippingAddress({
      country,
      city,
      state,
      postalCode,
    });

    // Get supported countries for error response
    const { SUPPORTED_COUNTRIES } = freightService;

    return res.status(validation.isValid ? 200 : 400).json({
      success: validation.isValid,
      isValid: validation.isValid,
      errors: validation.errors,
      supportedCountries: SUPPORTED_COUNTRIES,
    });
  } catch (error) {
    return handleServerError(res, error, "Error validating shipping address");
  }
};

/**
 * Get supported countries list
 * GET /api/freight/supported-countries
 */
const getSupportedCountries = async (req, res) => {
  try {
    const { SUPPORTED_COUNTRIES } = freightService;

    return res.status(200).json({
      success: true,
      data: {
        countries: SUPPORTED_COUNTRIES,
        defaultCountry: "New Zealand",
      },
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching supported countries");
  }
};

/**
 * Get local zone configuration
 * GET /api/admin/freight/local-zone
 */
const getLocalZoneConfig = async (req, res) => {
  try {
    const config = await freightService.getLocalZoneConfig();

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching local zone configuration");
  }
};

/**
 * Update local zone configuration
 * PUT /api/admin/freight/local-zone
 * Body: { city, region, postalPrefixes, suburbs }
 */
const updateLocalZoneConfig = async (req, res) => {
  try {
    const { city, region, postalPrefixes, suburbs } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const config = await freightService.updateLocalZoneConfig({
      city,
      region,
      postalPrefixes,
      suburbs,
    });

    return res.status(200).json({
      success: true,
      message: `Local zone updated to ${config.city}`,
      data: config,
    });
  } catch (error) {
    // Handle validation errors
    if (error.message.includes("not a valid")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return handleServerError(res, error, "Error updating local zone configuration");
  }
};

/**
 * Get available North Island cities for local zone
 * GET /api/admin/freight/available-cities
 */
const getAvailableCities = async (req, res) => {
  try {
    const { NZ_NORTH_ISLAND_CITIES } = freightService;

    return res.status(200).json({
      success: true,
      data: {
        cities: NZ_NORTH_ISLAND_CITIES,
        note: "Only North Island cities can be set as local zone",
      },
    });
  } catch (error) {
    return handleServerError(res, error, "Error fetching available cities");
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getFreightConfig,
  updateFreightConfig,
  calculateFreightCost,
  getZoneCosts,
  getPublicFreightConfig,
  // New address-based endpoints
  calculateFreightFromAddress,
  getFreightZonesInfo,
  validateShippingAddress,
  getSupportedCountries,
  // Local zone configuration
  getLocalZoneConfig,
  updateLocalZoneConfig,
  getAvailableCities,
};
