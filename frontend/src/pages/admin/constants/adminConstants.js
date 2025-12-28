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
  {
    icon: "💰",
    label: "Total Revenue",
    key: "totalRevenue",
    formatter: (value) => `$${value.toFixed(2)}`,
    to: "/admin/orders",
  },
];

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
