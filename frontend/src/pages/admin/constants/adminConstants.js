/////////////////////////////////////////////////////////////////////////
// =================== ADMIN CONSTANTS =============================== //
/////////////////////////////////////////////////////////////////////////

// This file contains constants used across the admin pages

// Dashboard stat cards configuration
export const STAT_CARDS = [
  {
    icon: "👥",
    label: "Total Users",
    key: "totalUsers",
    to: "/admin/users",
  },
  {
    icon: "📦",
    label: "Total Products",
    key: "totalProducts",
    to: "/admin/products",
  },
  {
    icon: "🛒",
    label: "Active Orders",
    key: "activeOrders",
    to: "/admin/orders",
  },
  // Note: Reviews card is now handled separately by ReviewStatCard
  {
    icon: "❤️",
    label: "Wishlisted Products",
    key: "productsWishlisted",
    to: "/admin/wishlists",
  },
  {
    icon: "💰",
    label: "Total Revenue",
    key: "totalRevenue",
    formatter: (value) => `NZD $${value.toFixed(2)}`,
    to: "/admin/orders",
  },
];

/////////////////////////////////////////////////////////////////////////
// =================== REVIEW STAT CARD CONFIG ======================= //
/////////////////////////////////////////////////////////////////////////

// Configuration for the review stat card with breakdown
export const REVIEW_STAT_CARD = {
  icon: "⭐",
  label: "Total Reviews",
  to: "/admin/reviews",
  breakdownLabels: {
    approved: "Approved",
    pending: "Pending",
  },
  breakdownColors: {
    approved: "#22c55e", // Green
    pending: "#f59e0b", // Amber/Orange
  },
};

// Dashboard action cards configuration
export const ACTION_CARDS = [
  {
    icon: "👥",
    title: "Manage Users",
    description: "View and manage user accounts",
    to: "/admin/users",
  },
  {
    icon: "📦",
    title: "Manage Products",
    description: "Add, edit, or remove products",
    to: "/admin/products",
  },
  {
    icon: "🛒",
    title: "View Orders",
    description: "Track and manage orders",
    to: "/admin/orders",
  },
  {
    icon: "⭐",
    title: "Manage Reviews",
    description: "View, approve, or delete reviews",
    to: "/admin/reviews",
  },
  {
    icon: "❤️",
    title: "View Wishlists",
    description: "Track product wishlist popularity",
    to: "/admin/wishlists",
  },
  {
    icon: "⚙️",
    title: "Settings",
    description: "Configure system settings",
    to: "/admin/settings",
  },
];

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// User status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

// Order status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Product status
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

/////////////////////////////////////////////////////////////////////////
// =================== STOCK LEVEL THRESHOLDS ======================== //
/////////////////////////////////////////////////////////////////////////

// Stock quantity thresholds for badge colors
// These values determine the color of the stock badge in the product table
export const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,      // Gray - No stock
  CRITICAL: 5,          // Red - 1-5 products
  LOW: 10,              // Yellow - 6-10 products
  MODERATE: 15,         // Yellow-Green - 11-15 products
  // Above MODERATE = Green - 15+ products
};

// Helper function to get stock level class name
export const getStockLevelClass = (quantity) => {
  if (quantity === 0) return "stockOutOfStock";
  if (quantity <= STOCK_THRESHOLDS.CRITICAL) return "stockCritical";
  if (quantity <= STOCK_THRESHOLDS.LOW) return "stockLow";
  if (quantity <= STOCK_THRESHOLDS.MODERATE) return "stockModerate";
  return "stockGood";
};

// Stock level descriptions
export const STOCK_LEVEL_LABELS = {
  stockOutOfStock: "Out of Stock",
  stockCritical: "Critical Stock",
  stockLow: "Low Stock",
  stockModerate: "Moderate Stock",
  stockGood: "In Stock",
};

/////////////////////////////////////////////////////////////////////////
// =================== PRODUCT IMAGE LIMITS ========================== //
/////////////////////////////////////////////////////////////////////////

// Maximum number of images allowed per product (Amazon standard: 9)
// 1 primary image + 8 additional images
export const PRODUCT_IMAGE_LIMIT = 9;
