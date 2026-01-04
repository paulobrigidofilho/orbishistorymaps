///////////////////////////////////////////////////////////////////////
// ================ PRODUCT IMAGE MODEL (SEQUELIZE) ================ //
///////////////////////////////////////////////////////////////////////

// This model defines the ProductImage entity for Sequelize ORM
// Handles product image gallery management

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const ProductImage = sequelize.define(
  "ProductImage",
  {
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    image_alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_images",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["product_id"] },
      { fields: ["is_primary"] },
    ],
  }
);

module.exports = ProductImage;
