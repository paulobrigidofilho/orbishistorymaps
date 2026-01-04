///////////////////////////////////////////////////////////////////////
// ================ ORDER MODEL (SEQUELIZE) ======================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Order entity for Sequelize ORM
// Handles order management, tracking, and status

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Order = sequelize.define(
  "Order",
  {
    order_id: {
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
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    order_status: {
      type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled", "refunded"),
      defaultValue: "pending",
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
    shipping_address_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: "addresses",
        key: "address_id",
      },
    },
    billing_address_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: "addresses",
        key: "address_id",
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["order_number"] },
      { fields: ["order_status"] },
      { fields: ["payment_status"] },
      { fields: ["created_at"] },
    ],
  }
);

module.exports = Order;
