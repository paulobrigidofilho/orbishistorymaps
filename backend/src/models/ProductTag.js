///////////////////////////////////////////////////////////////////////
// ================ PRODUCT TAG MODEL (SEQUELIZE) ================== //
///////////////////////////////////////////////////////////////////////

// This model defines the ProductTag entity for Sequelize ORM
// Handles flexible product tagging for search and filtering

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const ProductTag = sequelize.define(
  "ProductTag",
  {
    tag_id: {
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
    tag_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "product_tags",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["product_id"] },
      { fields: ["tag_name"] },
      { unique: true, fields: ["product_id", "tag_name"] },
    ],
  }
);

module.exports = ProductTag;
