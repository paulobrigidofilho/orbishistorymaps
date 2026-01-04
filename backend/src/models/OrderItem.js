///////////////////////////////////////////////////////////////////////
// ================ ORDER ITEM MODEL (SEQUELIZE) =================== //
///////////////////////////////////////////////////////////////////////

// This model defines the OrderItem entity for Sequelize ORM
// Handles individual items within an order

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "orders",
        key: "order_id",
      },
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["order_id"] },
      { fields: ["product_id"] },
    ],
  }
);

module.exports = OrderItem;
