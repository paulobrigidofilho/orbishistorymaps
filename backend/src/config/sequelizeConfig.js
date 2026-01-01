///////////////////////////////////////////////////////////////////////
// ================ SEQUELIZE CONFIGURATION ======================== //
///////////////////////////////////////////////////////////////////////

// This file initializes and exports the Sequelize instance for ORM operations
// Centralizes database connection using environment variables

// ======= Module Imports ======= //
const { Sequelize } = require("sequelize");
const path = require("path");

// ======= Environment Loading ======= //
const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../.env.prod")
    : path.resolve(__dirname, "../../.env.dev");
require("dotenv").config({ path: envFilePath });

///////////////////////////////////////////////////////////////////////
// ================ SEQUELIZE INSTANCE ============================= //
///////////////////////////////////////////////////////////////////////

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

///////////////////////////////////////////////////////////////////////
// ================ CONNECTION TEST ================================ //
///////////////////////////////////////////////////////////////////////

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Sequelize connection established successfully.");
    return true;
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
