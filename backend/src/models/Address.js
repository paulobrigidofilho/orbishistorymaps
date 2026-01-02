///////////////////////////////////////////////////////////////////////
// ================ ADDRESS MODEL (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Address entity for Sequelize ORM
// Handles user shipping and billing addresses with Google Places integration
// Supports zone classification for freight calculation

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ CONSTANTS ====================================== //
///////////////////////////////////////////////////////////////////////

// Supported countries for shipping
const SUPPORTED_COUNTRIES = [
  "New Zealand",
  "United States",
  "Canada", 
  "Brazil",
  "Portugal",
  "United Kingdom",
  "China",
];

// Freight zone types
const FREIGHT_ZONES = {
  LOCAL: "local",                     // Tauranga City only
  NORTH_ISLAND: "north_island",       // NZ North Island (excluding Tauranga)
  SOUTH_ISLAND: "south_island",       // NZ South Island
  INTL_NORTH_AMERICA: "intl_north_america",  // USA, Canada
  INTL_ASIA: "intl_asia",             // China
  INTL_EUROPE: "intl_europe",         // UK, Portugal
  INTL_LATIN_AMERICA: "intl_latin_america",  // Brazil
};

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Address = sequelize.define(
  "Address",
  {
    address_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    address_type: {
      type: DataTypes.ENUM("shipping", "billing"),
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    // ===== Standard Address Fields ===== //
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "State/Region/Province - used for NZ North/South Island detection",
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "New Zealand",
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // ===== Google Places API Fields ===== //
    google_place_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Google Places API place_id for address validation",
    },
    formatted_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Full formatted address from Google Places API",
    },
    // ===== Zone Classification Fields ===== //
    freight_zone: {
      type: DataTypes.ENUM(
        "local",
        "north_island", 
        "south_island",
        "intl_north_america",
        "intl_asia",
        "intl_europe",
        "intl_latin_america"
      ),
      allowNull: true,
      comment: "Calculated freight zone for shipping cost determination",
    },
    is_tauranga: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether address is within Tauranga City (local zone)",
    },
  },
  {
    tableName: "addresses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["address_type"] },
      { fields: ["is_default"] },
      { fields: ["freight_zone"] },
      { fields: ["country"] },
    ],
  }
);

///////////////////////////////////////////////////////////////////////
// ================ STATIC METHODS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Get supported countries list
 * @returns {string[]} Array of supported country names
 */
Address.getSupportedCountries = function () {
  return SUPPORTED_COUNTRIES;
};

/**
 * Get freight zone constants
 * @returns {Object} Freight zone mapping object
 */
Address.getFreightZones = function () {
  return FREIGHT_ZONES;
};

module.exports = Address;
