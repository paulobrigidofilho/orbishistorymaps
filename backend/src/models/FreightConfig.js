///////////////////////////////////////////////////////////////////////
// ================ FREIGHT CONFIG MODEL (SEQUELIZE) =============== //
///////////////////////////////////////////////////////////////////////

// This model stores freight/shipping costs configuration
// Includes zone-based pricing and free freight thresholds

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const FreightConfig = sequelize.define(
  "FreightConfig",
  {
    config_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ===== Zone-Based Freight Costs ===== //
    local: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 12.00,
      comment: "Local delivery cost (base rate)",
    },
    north_island: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "NZ North Island delivery cost",
    },
    south_island: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "NZ South Island delivery cost",
    },
    intl_north_america: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "International - North America delivery cost",
    },
    intl_asia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "International - Asia delivery cost",
    },
    intl_europe: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "International - Europe delivery cost",
    },
    intl_africa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "International - Africa delivery cost",
    },
    intl_latin_america: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "International - Latin America delivery cost",
    },
    // ===== Free Freight Configuration ===== //
    is_free_freight_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether free freight is enabled",
    },
    threshold_local: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 200.00,
      comment: "Order total threshold for free local delivery",
    },
    threshold_national: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 300.00,
      comment: "Order total threshold for free national delivery (NZ)",
    },
    threshold_international: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 500.00,
      comment: "Order total threshold for free international delivery",
    },
    // ===== Configurable Local Zone ===== //
    local_zone_city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Tauranga",
      comment: "City name for the local delivery zone",
    },
    local_zone_region: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Bay of Plenty",
      comment: "Region/state for the local delivery zone",
    },
    local_zone_postal_prefixes: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "310,311,312,314,315,316",
      comment: "Comma-separated postal code prefixes for local zone",
    },
    local_zone_suburbs: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "Mount Maunganui,Mt Maunganui,Papamoa,Pāpāmoa,Bethlehem,Otumoetai,Welcome Bay,Greerton,Gate Pa,Tauranga South,Matua,Brookfield,Parkvale,Maungatapu",
      comment: "Comma-separated suburb names included in local zone",
    },
  },
  {
    tableName: "freight_config",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

///////////////////////////////////////////////////////////////////////
// ================ INSTANCE METHODS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Get freight cost for a specific zone
 * @param {string} zone - The delivery zone
 * @param {number} orderTotal - The order total for free freight calculation
 * @returns {number} The freight cost
 */
FreightConfig.prototype.getFreightCost = function (zone, orderTotal = 0) {
  const zoneMap = {
    local: { cost: this.local, threshold: this.threshold_local },
    north_island: { cost: this.north_island, threshold: this.threshold_national },
    south_island: { cost: this.south_island, threshold: this.threshold_national },
    intl_north_america: { cost: this.intl_north_america, threshold: this.threshold_international },
    intl_asia: { cost: this.intl_asia, threshold: this.threshold_international },
    intl_europe: { cost: this.intl_europe, threshold: this.threshold_international },
    intl_africa: { cost: this.intl_africa, threshold: this.threshold_international },
    intl_latin_america: { cost: this.intl_latin_america, threshold: this.threshold_international },
  };

  const zoneConfig = zoneMap[zone];
  if (!zoneConfig) return 0;

  // Check if free freight applies
  if (this.is_free_freight_enabled && zoneConfig.threshold && orderTotal >= zoneConfig.threshold) {
    return 0;
  }

  return parseFloat(zoneConfig.cost) || 0;
};

///////////////////////////////////////////////////////////////////////
// ================ STATIC METHODS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Get the current freight configuration (singleton pattern)
 * Creates default config if none exists
 */
FreightConfig.getConfig = async function () {
  let config = await FreightConfig.findOne();
  
  if (!config) {
    // Create default configuration
    config = await FreightConfig.create({
      local: 12.00,
      north_island: 12.60,      // 1.05 * 12
      south_island: 12.96,      // 1.08 * 12
      intl_asia: 13.80,         // 1.15 * 12
      intl_north_america: 15.00, // 1.25 * 12
      intl_europe: 15.00,       // 1.25 * 12
      intl_africa: 15.00,       // 1.25 * 12
      intl_latin_america: 15.00, // 1.25 * 12
      is_free_freight_enabled: false,
      threshold_local: 200.00,
      threshold_national: 300.00,
      threshold_international: 500.00,
    });
  }
  
  return config;
};

/**
 * Update freight configuration
 * @param {Object} data - The data to update
 */
FreightConfig.updateConfig = async function (data) {
  let config = await FreightConfig.findOne();
  
  if (!config) {
    config = await FreightConfig.create(data);
  } else {
    await config.update(data);
    // Reload to get fresh data from database
    await config.reload();
  }
  
  return config;
};

module.exports = FreightConfig;
