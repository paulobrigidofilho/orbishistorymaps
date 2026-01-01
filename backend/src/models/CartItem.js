///////////////////////////////////////////////////////////////////////
// ================ CART ITEM MODEL (SEQUELIZE) ==================== //
///////////////////////////////////////////////////////////////////////

// This model defines the CartItem entity for Sequelize ORM
// Handles individual items within a shopping cart

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const CartItem = sequelize.define(
  "CartItem",
  {
    cart_item_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    cart_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "cart",
        key: "cart_id",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    price_at_addition: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["cart_id"] },
      { fields: ["product_id"] },
    ],
  }
);

module.exports = CartItem;
