///////////////////////////////////////////////////////////////////////
// ================ PRODUCT MODEL (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Product entity for Sequelize ORM
// Handles product information, pricing, and catalog management

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    product_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    product_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    product_slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "product_categories",
        key: "category_id",
      },
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rating_average: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
    },
    rating_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["category_id"] },
      { fields: ["product_slug"] },
      { fields: ["sku"] },
      { fields: ["is_active"] },
      { fields: ["is_featured"] },
      { fields: ["price"] },
    ],
  }
);

module.exports = Product;
