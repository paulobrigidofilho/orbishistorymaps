///////////////////////////////////////////////////////////////////////
// ================ FREIGHT DEFAULTS CALCULATOR ==================== //
///////////////////////////////////////////////////////////////////////

// This helper calculates default freight values based on the local rate
// Uses realistic NZ shipping benchmarks with Tauranga as base
// Default Local Rate: $30.00

/**
 * Freight multipliers for each zone (based on $30 local = Tauranga)
 */
export const FREIGHT_MULTIPLIERS = {
  north_island: 1.5,      // $30 -> $45 (NZ North Island Metro)
  south_island: 2.83,     // $30 -> $85 (NZ South Island)
  rural_surcharge: 0.5,   // $30 -> $15 (flat rural fee)
  intl_asia: 4.0,         // $30 -> $120
  intl_north_america: 5.0, // $30 -> $150
  intl_europe: 5.0,       // $30 -> $150
  intl_africa: 6.0,       // $30 -> $180
  intl_latin_america: 5.33, // $30 -> $160
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
 * Default rural surcharge
 */
export const DEFAULT_RURAL_SURCHARGE = 15.00;

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
    rural_surcharge: DEFAULT_RURAL_SURCHARGE,
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
    rural_surcharge: data.rural_surcharge !== "" && data.rural_surcharge != null 
      ? parseFloat(data.rural_surcharge) 
      : defaults.rural_surcharge,
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
  if (isNaN(num)) return "NZD $0.00";
  return `NZD $${num.toFixed(2)}`;
};

export default calculateFreightDefaults;
