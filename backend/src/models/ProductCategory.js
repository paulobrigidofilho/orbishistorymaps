///////////////////////////////////////////////////////////////////////
// ================ PRODUCT CATEGORY MODEL (SEQUELIZE) ============= //
///////////////////////////////////////////////////////////////////////

// This model defines the ProductCategory entity for Sequelize ORM
// Handles product categorization with hierarchical support

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    category_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "product_categories",
        key: "category_id",
      },
    },
    category_slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "product_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["parent_category_id"] },
      { fields: ["category_slug"] },
      { fields: ["is_active"] },
    ],
  }
);

module.exports = ProductCategory;
