/////////////////////////////////////////
// ===== ADMIN VALIDATOR ============= //
/////////////////////////////////////////

// Joi validation schemas for admin operations

// ======= Module imports ======= //
const Joi = require("joi");

///////////////////////////////////////
// ===== User Management Schemas === //
///////////////////////////////////////

// ===== Update User Status Schema ===== //
const updateUserStatusSchema = Joi.object({
  status: Joi.string()
    .valid("active", "inactive", "suspended")
    .required()
    .messages({
      "any.required": "Status is required",
      "string.empty": "Status is required",
      "any.only": "Status must be one of: active, inactive, suspended",
    }),
});

// ===== Update User Role Schema ===== //
const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid("user", "admin")
    .required()
    .messages({
      "any.required": "Role is required",
      "string.empty": "Role is required",
      "any.only": "Role must be one of: user, admin",
    }),
});

///////////////////////////////////////
// ===== Product Management Schemas ==//
///////////////////////////////////////

// ===== Create Product Schema ===== //
const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "any.required": "Product name is required",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name must not exceed 255 characters",
    }),
    
  description: Joi.string()
    .max(5000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Description must not exceed 5000 characters",
    }),
    
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "any.required": "Price is required",
      "number.base": "Price must be a valid number",
      "number.positive": "Price must be greater than 0",
    }),
    
  sale_price: Joi.number()
    .positive()
    .precision(2)
    .less(Joi.ref("price"))
    .allow(null)
    .optional()
    .messages({
      "number.base": "Sale price must be a valid number",
      "number.positive": "Sale price must be greater than 0",
      "number.less": "Sale price must be less than regular price",
    }),
    
  sku: Joi.string()
    .max(100)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "SKU must not exceed 100 characters",
    }),
    
  quantity_available: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a valid number",
      "number.integer": "Quantity must be a whole number",
      "number.min": "Quantity cannot be negative",
    }),
    
  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Category ID must be a valid number",
      "number.integer": "Category ID must be a whole number",
      "number.positive": "Category ID must be greater than 0",
    }),
    
  is_featured: Joi.boolean()
    .optional()
    .default(false),
    
  is_active: Joi.boolean()
    .optional()
    .default(true),
});

// ===== Update Product Schema ===== //
const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .optional()
    .messages({
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name must not exceed 255 characters",
    }),
    
  description: Joi.string()
    .max(5000)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Description must not exceed 5000 characters",
    }),
    
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.base": "Price must be a valid number",
      "number.positive": "Price must be greater than 0",
    }),
    
  sale_price: Joi.number()
    .positive()
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Sale price must be a valid number",
      "number.positive": "Sale price must be greater than 0",
    }),
    
  sku: Joi.string()
    .max(100)
    .allow("", null)
    .optional()
    .messages({
      "string.max": "SKU must not exceed 100 characters",
    }),
    
  quantity_available: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "Quantity must be a valid number",
      "number.integer": "Quantity must be a whole number",
      "number.min": "Quantity cannot be negative",
    }),
    
  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "Category ID must be a valid number",
      "number.integer": "Category ID must be a whole number",
      "number.positive": "Category ID must be greater than 0",
    }),
    
  is_featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
}).min(1); // At least one field must be provided

// ===== Pagination/Filter Schema ===== //
const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(20),
    
  search: Joi.string()
    .max(255)
    .allow("")
    .optional(),
    
  role: Joi.string()
    .valid("user", "admin", "all")
    .optional(),
    
  status: Joi.string()
    .valid("active", "inactive", "suspended", "all")
    .optional(),
    
  country: Joi.string()
    .max(100)
    .allow("")
    .optional(),
    
  sortBy: Joi.string()
    .valid(
      // User fields
      "user_id",
      "user_email",
      "user_firstname",
      "user_lastname",
      "user_role",
      "user_status",
      "user_country",
      "user_created_at",
      "user_updated_at",
      // Product fields
      "product_id",
      "product_name",
      "sku",
      "price",
      "quantity_available",
      "view_count",
      "rating_average",
      "rating_count",
      "created_at",
      "updated_at"
    )
    .optional()
    .default("user_id"),
    
  sortOrder: Joi.string()
    .valid("asc", "desc")
    .optional()
    .default("desc"),
    
  category_id: Joi.number()
    .integer()
    .positive()
    .optional(),
    
  is_active: Joi.boolean()
    .optional(),
    
  is_featured: Joi.boolean()
    .optional(),
});

module.exports = {
  updateUserStatusSchema,
  updateUserRoleSchema,
  createProductSchema,
  updateProductSchema,
  querySchema,
};
