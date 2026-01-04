///////////////////////////////////////////////////////////////////////
// ================ PAYMENT MODEL (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Payment entity for Sequelize ORM
// Handles payment transactions and gateway responses

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
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
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
    payment_gateway: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gateway_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["order_id"] },
      { fields: ["transaction_id"] },
      { fields: ["payment_status"] },
    ],
  }
);

module.exports = Payment;
