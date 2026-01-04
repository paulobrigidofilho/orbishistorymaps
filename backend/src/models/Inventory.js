///////////////////////////////////////////////////////////////////////
// ================ INVENTORY MODEL (SEQUELIZE) ==================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Inventory entity for Sequelize ORM
// Handles product stock levels and inventory management

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Inventory = sequelize.define(
  "Inventory",
  {
    inventory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    quantity_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quantity_reserved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    reorder_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
    },
    last_restocked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "inventory",
    timestamps: true,
    createdAt: false,
    updatedAt: "updated_at",
    indexes: [
      { fields: ["product_id"] },
      { fields: ["quantity_available"] },
    ],
  }
);

module.exports = Inventory;
