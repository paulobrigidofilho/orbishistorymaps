///////////////////////////////////////////////////////////////////////
// =================== POST MODEL (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This model defines the Post entity for Sequelize ORM
// Handles blog posts, news, and announcements for the admin system

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const Post = sequelize.define(
  "Post",
  {
    post_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    post_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    post_slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    post_content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    post_excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Short preview text for post cards",
    },
    post_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Header image URL for the post",
    },
    post_view_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    post_publish_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Scheduled publish date",
    },
    post_status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    // SEO Metadata
    seo_description: {
      type: DataTypes.STRING(160),
      allowNull: true,
      comment: "Meta description for SEO (max 160 chars)",
    },
    seo_keywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Comma-separated keywords for SEO",
    },
    // Author reference
    author_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["post_slug"], unique: true },
      { fields: ["post_status"] },
      { fields: ["post_publish_date"] },
      { fields: ["author_id"] },
    ],
  }
);

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = Post;
