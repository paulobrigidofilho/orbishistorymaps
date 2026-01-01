///////////////////////////////////////////////////////////////////////
// ================ USER MODEL (SEQUELIZE) ========================= //
///////////////////////////////////////////////////////////////////////

// This model defines the User entity for Sequelize ORM
// Handles user authentication, profile, and role management

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
    user_firstname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    user_lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_zipcode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    user_role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    user_status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_role"] },
      { fields: ["user_status"] },
      { fields: ["user_email"] },
    ],
  }
);

module.exports = User;
