///////////////////////////////////////////////////////////////////////
// ================ ADDRESS MODEL (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Address entity for Sequelize ORM
// Handles user shipping and billing addresses

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

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
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "USA",
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    ],
  }
);

module.exports = Address;
