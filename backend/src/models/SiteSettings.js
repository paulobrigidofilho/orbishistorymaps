///////////////////////////////////////////////////////////////////////
// ================ SITE SETTINGS MODEL (SEQUELIZE) ================ //
///////////////////////////////////////////////////////////////////////

// This model stores global site configuration settings
// Includes maintenance mode, currency, registration, and general settings

// ======= Module Imports ======= //
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

///////////////////////////////////////////////////////////////////////
// ================ MODEL DEFINITION =============================== //
///////////////////////////////////////////////////////////////////////

const SiteSettings = sequelize.define(
  "SiteSettings",
  {
    setting_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    setting_type: {
      type: DataTypes.ENUM("string", "number", "boolean", "json"),
      defaultValue: "string",
    },
    setting_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    setting_category: {
      type: DataTypes.STRING(50),
      defaultValue: "general",
    },
  },
  {
    tableName: "site_settings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["setting_key"] },
      { fields: ["setting_category"] },
    ],
  }
);

///////////////////////////////////////////////////////////////////////
// ================ HELPER METHODS ================================= //
///////////////////////////////////////////////////////////////////////

/**
 * Get a setting value by key
 * @param {string} key - The setting key
 * @param {any} defaultValue - Default value if setting not found
 * @returns {Promise<any>} The setting value (parsed if boolean/number/json)
 */
SiteSettings.getSetting = async function (key, defaultValue = null) {
  const setting = await this.findOne({ where: { setting_key: key } });
  if (!setting) return defaultValue;

  const value = setting.setting_value;
  const type = setting.setting_type;

  switch (type) {
    case "boolean":
      return value === "true" || value === "1";
    case "number":
      return parseFloat(value);
    case "json":
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    default:
      return value;
  }
};

/**
 * Set a setting value by key
 * @param {string} key - The setting key
 * @param {any} value - The value to set
 * @param {object} options - Additional options (type, description, category)
 * @returns {Promise<SiteSettings>} The updated/created setting
 */
SiteSettings.setSetting = async function (key, value, options = {}) {
  const { type = "string", description = null, category = "general" } = options;

  // Convert value to string for storage
  let stringValue;
  if (type === "boolean") {
    stringValue = value ? "true" : "false";
  } else if (type === "json") {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = String(value);
  }

  const [setting] = await this.upsert({
    setting_key: key,
    setting_value: stringValue,
    setting_type: type,
    setting_description: description,
    setting_category: category,
  });

  return setting;
};

/**
 * Get all settings by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Object>} Object with key-value pairs
 */
SiteSettings.getSettingsByCategory = async function (category) {
  const settings = await this.findAll({
    where: { setting_category: category },
  });

  return settings.reduce((acc, setting) => {
    let value = setting.setting_value;
    switch (setting.setting_type) {
      case "boolean":
        value = value === "true" || value === "1";
        break;
      case "number":
        value = parseFloat(value);
        break;
      case "json":
        try {
          value = JSON.parse(value);
        } catch {
          value = null;
        }
        break;
    }
    acc[setting.setting_key] = value;
    return acc;
  }, {});
};

/**
 * Get all settings
 * @returns {Promise<Object>} Object with all settings as key-value pairs
 */
SiteSettings.getAllSettings = async function () {
  const settings = await this.findAll();

  return settings.reduce((acc, setting) => {
    let value = setting.setting_value;
    switch (setting.setting_type) {
      case "boolean":
        value = value === "true" || value === "1";
        break;
      case "number":
        value = parseFloat(value);
        break;
      case "json":
        try {
          value = JSON.parse(value);
        } catch {
          value = null;
        }
        break;
    }
    acc[setting.setting_key] = value;
    return acc;
  }, {});
};

module.exports = SiteSettings;
