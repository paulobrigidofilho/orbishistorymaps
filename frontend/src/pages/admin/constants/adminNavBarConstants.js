///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR BUTTON CONSTANTS ================ //
///////////////////////////////////////////////////////////////////////

// Each object represents a button in the admin nav bar
// icon: emoji or icon string, label: button text, to: route, condition: optional function for conditional rendering

export const adminNavBarButtons = [
  {
    key: "dashboard",
    to: "/admin",
    icon: "📊",
    label: "Dashboard",
    exact: true,
    show: () => true,
  },
  {
    key: "users",
    to: "/admin/users",
    icon: "👥",
    label: "Users",
    show: () => true,
  },
  {
    key: "products",
    to: "/admin/products",
    icon: "📦",
    label: "Products",
    show: () => true,
  },
  {
    key: "orders",
    to: "/admin/orders",
    icon: "🛒",
    label: "Orders",
    show: () => true,
  },
  {
    key: "reviews",
    to: "/admin/reviews",
    icon: "⭐",
    label: "Reviews",
    show: () => true,
  },
  {
    key: "wishlists",
    to: "/admin/wishlists",
    icon: "❤️",
    label: "Wishlists",
    show: () => true,
  },
  {
    key: "settings",
    to: "/admin/settings",
    icon: "⚙️",
    label: "Settings",
    show: () => true,
  },
];

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN NAVBAR BUTTON CONSTANTS ============ //
///////////////////////////////////////////////////////////////////////
