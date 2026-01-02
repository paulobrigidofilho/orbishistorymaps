///////////////////////////////////////////////////////////////////////
// ================ USER MODEL (SEQUELIZE) ========================= //
///////////////////////////////////////////////////////////////////////

// This model defines the User entity for Sequelize ORM
// Handles user authentication, profile, and role management
// Includes Google Places address fields for freight zone calculation

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
    user_firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    user_lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // ===== Address Fields ===== //
    user_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Street number and name",
    },
    user_address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Unit, apartment, suite number",
    },
    user_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "City or suburb",
    },
    user_state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "State, region, or province - used for NZ island detection",
    },
    user_zipcode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "Postal code or zip code",
    },
    user_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "New Zealand",
      comment: "Country - defaults to New Zealand",
    },
    // ===== Google Places API Fields ===== //
    user_google_place_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Google Places API place_id for address validation",
    },
    user_formatted_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Full formatted address from Google Places API",
    },
    // ===== Freight Zone Fields ===== //
    user_freight_zone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Calculated freight zone: local, north_island, south_island, intl_*",
    },
    user_is_tauranga: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether user address is within Tauranga City (local zone)",
    },
    // ===== Account Fields ===== //
    user_role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    user_status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_role"] },
      { fields: ["user_status"] },
      { fields: ["user_email"] },
      { fields: ["user_country"] },
      { fields: ["user_freight_zone"] },
    ],
  }
);

module.exports = User;
