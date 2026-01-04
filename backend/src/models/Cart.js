///////////////////////////////////////////////////////////////////////
// ================ CART MODEL (SEQUELIZE) ========================= //
///////////////////////////////////////////////////////////////////////

// This model defines the Cart entity for Sequelize ORM
// Handles shopping cart management for users and guests

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "cart",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["session_id"] },
      { fields: ["expires_at"] },
    ],
  }
);

module.exports = Cart;
