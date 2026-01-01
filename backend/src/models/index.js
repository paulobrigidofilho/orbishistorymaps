///////////////////////////////////////////////////////////////////////
// ================ MODELS INDEX (SEQUELIZE) ======================= //
///////////////////////////////////////////////////////////////////////

// This file centralizes all Sequelize models and defines associations
// Import this file to access all models with their relationships

// ======= Module Imports ======= //
const { sequelize } = require("../config/sequelizeConfig");

// ======= Model Imports ======= //
const User = require("./User");
const PasswordReset = require("./PasswordReset");
const ProductCategory = require("./ProductCategory");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const ProductTag = require("./ProductTag");
const Inventory = require("./Inventory");
const Address = require("./Address");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const ProductReview = require("./ProductReview");
const Wishlist = require("./Wishlist");

///////////////////////////////////////////////////////////////////////
// ================ MODEL ASSOCIATIONS ============================= //
///////////////////////////////////////////////////////////////////////

// ===== User Associations ===== //
User.hasMany(PasswordReset, { foreignKey: "user_id", onDelete: "CASCADE" });
PasswordReset.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Address, { as: "addresses", foreignKey: "user_id", onDelete: "CASCADE" });
Address.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(Cart, { as: "carts", foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(Order, { as: "orders", foreignKey: "user_id", onDelete: "RESTRICT" });
Order.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(ProductReview, { as: "reviews", foreignKey: "user_id", onDelete: "CASCADE" });
ProductReview.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(Wishlist, { as: "wishlists", foreignKey: "user_id", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { as: "user", foreignKey: "user_id" });

// ===== ProductCategory Associations ===== //
ProductCategory.hasMany(ProductCategory, {
  as: "subcategories",
  foreignKey: "parent_category_id",
  onDelete: "SET NULL",
});
ProductCategory.belongsTo(ProductCategory, {
  as: "parentCategory",
  foreignKey: "parent_category_id",
});

ProductCategory.hasMany(Product, { foreignKey: "category_id", onDelete: "SET NULL" });
Product.belongsTo(ProductCategory, { as: "category", foreignKey: "category_id" });

// ===== Product Associations ===== //
Product.hasMany(ProductImage, { as: "images", foreignKey: "product_id", onDelete: "CASCADE" });
ProductImage.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasMany(ProductTag, { as: "tags", foreignKey: "product_id", onDelete: "CASCADE" });
ProductTag.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasOne(Inventory, { as: "inventory", foreignKey: "product_id", onDelete: "CASCADE" });
Inventory.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasMany(CartItem, { as: "cartItems", foreignKey: "product_id", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasMany(OrderItem, { as: "orderItems", foreignKey: "product_id", onDelete: "RESTRICT" });
OrderItem.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasMany(ProductReview, { as: "reviews", foreignKey: "product_id", onDelete: "CASCADE" });
ProductReview.belongsTo(Product, { as: "product", foreignKey: "product_id" });

Product.hasMany(Wishlist, { as: "wishlists", foreignKey: "product_id", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { as: "product", foreignKey: "product_id" });

// ===== Cart Associations ===== //
Cart.hasMany(CartItem, { as: "items", foreignKey: "cart_id", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { as: "cart", foreignKey: "cart_id" });

// ===== Order Associations ===== //
Order.hasMany(OrderItem, { as: "items", foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { as: "order", foreignKey: "order_id" });

Order.hasMany(Payment, { as: "payments", foreignKey: "order_id", onDelete: "CASCADE" });
Payment.belongsTo(Order, { as: "order", foreignKey: "order_id" });

Order.belongsTo(Address, { as: "shippingAddress", foreignKey: "shipping_address_id" });
Order.belongsTo(Address, { as: "billingAddress", foreignKey: "billing_address_id" });

Order.hasMany(ProductReview, { as: "reviews", foreignKey: "order_id", onDelete: "SET NULL" });
ProductReview.belongsTo(Order, { as: "order", foreignKey: "order_id" });

///////////////////////////////////////////////////////////////////////
// ================ SYNC FUNCTION ================================== //
///////////////////////////////////////////////////////////////////////

const syncDatabase = async (options = {}) => {
  try {
    // Default to alter: false for safety in production
    const syncOptions = {
      alter: process.env.NODE_ENV === "development" ? false : false,
      ...options,
    };
    
    await sequelize.sync(syncOptions);
    console.log("✓ All models synchronized successfully.");
    return true;
  } catch (error) {
    console.error("✗ Model synchronization failed:", error.message);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  sequelize,
  syncDatabase,
  
  // Models
  User,
  PasswordReset,
  ProductCategory,
  Product,
  ProductImage,
  ProductTag,
  Inventory,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  ProductReview,
  Wishlist,
};
