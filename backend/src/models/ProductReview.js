///////////////////////////////////////////////////////////////////////
// ================ PRODUCT REVIEW MODEL (SEQUELIZE) =============== //
///////////////////////////////////////////////////////////////////////

// This model defines the ProductReview entity for Sequelize ORM
// Handles product ratings, reviews, and approval workflow

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const ProductReview = sequelize.define(
  "ProductReview",
  {
    review_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    user_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    order_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: "orders",
        key: "order_id",
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_verified_purchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    helpful_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["product_id"] },
      { fields: ["user_id"] },
      { fields: ["rating"] },
      { fields: ["is_approved"] },
    ],
  }
);

module.exports = ProductReview;
