///////////////////////////////////////////////////////////////////////
// ================ WISHLIST MODEL (SEQUELIZE) ===================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Wishlist entity for Sequelize ORM
// Handles user product wishlists

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Wishlist = sequelize.define(
  "Wishlist",
  {
    wishlist_id: {
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
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
  },
  {
    tableName: "wishlist",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["product_id"] },
      { unique: true, fields: ["user_id", "product_id"] },
    ],
  }
);

module.exports = Wishlist;
