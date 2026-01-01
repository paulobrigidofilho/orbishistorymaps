///////////////////////////////////////////////////////////////////////
// ================ PASSWORD RESET MODEL (SEQUELIZE) =============== //
///////////////////////////////////////////////////////////////////////

// This model defines the PasswordReset entity for Sequelize ORM
// Handles password reset token storage and validation

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    reset_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    reset_token: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "password_resets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["reset_token"] },
      { fields: ["user_id"] },
      { fields: ["expires_at"] },
    ],
  }
);

module.exports = PasswordReset;
