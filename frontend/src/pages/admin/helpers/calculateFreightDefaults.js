///////////////////////////////////////////////////////////////////////
// ================ FREIGHT DEFAULTS CALCULATOR ==================== //
///////////////////////////////////////////////////////////////////////

// This helper calculates default freight values based on the local rate
// Used when fields are left empty during save

/**
 * Freight multipliers for each zone
 */
export const FREIGHT_MULTIPLIERS = {
  north_island: 1.05,
  south_island: 1.08,
  intl_asia: 1.15,
  intl_north_america: 1.25,
  intl_europe: 1.25,
  intl_africa: 1.25,
  intl_latin_america: 1.25,
};

/**
 * Default free freight thresholds
 */
export const DEFAULT_THRESHOLDS = {
  local: 200.00,
  national: 300.00,
  international: 500.00,
};

/**
 * Calculate default freight costs based on local rate
 * @param {number|string} localRate - The base local freight rate
 * @returns {Object} Calculated default rates for all zones
 */
export const calculateFreightDefaults = (localRate) => {
  const local = parseFloat(localRate);
  
  if (isNaN(local) || local <= 0) {
    return null;
  }
  
  return {
    local,
    north_island: parseFloat((local * FREIGHT_MULTIPLIERS.north_island).toFixed(2)),
    south_island: parseFloat((local * FREIGHT_MULTIPLIERS.south_island).toFixed(2)),
    intl_asia: parseFloat((local * FREIGHT_MULTIPLIERS.intl_asia).toFixed(2)),
    intl_north_america: parseFloat((local * FREIGHT_MULTIPLIERS.intl_north_america).toFixed(2)),
    intl_europe: parseFloat((local * FREIGHT_MULTIPLIERS.intl_europe).toFixed(2)),
    intl_africa: parseFloat((local * FREIGHT_MULTIPLIERS.intl_africa).toFixed(2)),
    intl_latin_america: parseFloat((local * FREIGHT_MULTIPLIERS.intl_latin_america).toFixed(2)),
  };
};

/**
 * Apply defaults to freight data where values are empty
 * @param {Object} data - The freight data to process
 * @returns {Object} Processed data with defaults applied
 */
export const applyFreightDefaults = (data) => {
  const local = parseFloat(data.local);
  
  if (isNaN(local) || local <= 0) {
    throw new Error("Local freight cost is required");
  }

  const defaults = calculateFreightDefaults(local);
  
  return {
    local,
    north_island: data.north_island !== "" && data.north_island != null 
      ? parseFloat(data.north_island) 
      : defaults.north_island,
    south_island: data.south_island !== "" && data.south_island != null 
      ? parseFloat(data.south_island) 
      : defaults.south_island,
    intl_asia: data.intl_asia !== "" && data.intl_asia != null 
      ? parseFloat(data.intl_asia) 
      : defaults.intl_asia,
    intl_north_america: data.intl_north_america !== "" && data.intl_north_america != null 
      ? parseFloat(data.intl_north_america) 
      : defaults.intl_north_america,
    intl_europe: data.intl_europe !== "" && data.intl_europe != null 
      ? parseFloat(data.intl_europe) 
      : defaults.intl_europe,
    intl_africa: data.intl_africa !== "" && data.intl_africa != null 
      ? parseFloat(data.intl_africa) 
      : defaults.intl_africa,
    intl_latin_america: data.intl_latin_america !== "" && data.intl_latin_america != null 
      ? parseFloat(data.intl_latin_america) 
      : defaults.intl_latin_america,
    is_free_freight_enabled: Boolean(data.is_free_freight_enabled),
    threshold_local: data.threshold_local !== "" && data.threshold_local != null 
      ? parseFloat(data.threshold_local) 
      : DEFAULT_THRESHOLDS.local,
    threshold_national: data.threshold_national !== "" && data.threshold_national != null 
      ? parseFloat(data.threshold_national) 
      : DEFAULT_THRESHOLDS.national,
    threshold_international: data.threshold_international !== "" && data.threshold_international != null 
      ? parseFloat(data.threshold_international) 
      : DEFAULT_THRESHOLDS.international,
  };
};

/**
 * Format currency value for display
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: NZD)
 * @returns {string} Formatted currency string
 */
export const formatFreightCost = (value, currency = "NZD") => {
  const num = parseFloat(value);
  if (isNaN(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
};

export default calculateFreightDefaults;
