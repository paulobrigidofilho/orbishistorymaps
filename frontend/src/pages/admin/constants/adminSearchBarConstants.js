///////////////////////////////////////////////////////////////////////
// =================== ADMIN SEARCH BAR CONSTANTS =================== //
///////////////////////////////////////////////////////////////////////

// Configuration for search bar and filters across all admin pages
// Each page type has its own search placeholder and filter definitions

///////////////////////////////////////////////////////////////////////
// ====================== PAGE TYPES ================================= //
///////////////////////////////////////////////////////////////////////

export const ADMIN_PAGE_TYPES = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
};

///////////////////////////////////////////////////////////////////////
// ====================== SEARCH PLACEHOLDERS ======================== //
///////////////////////////////////////////////////////////////////////

export const SEARCH_PLACEHOLDERS = {
  [ADMIN_PAGE_TYPES.USERS]: "Search by name or email...",
  [ADMIN_PAGE_TYPES.PRODUCTS]: "Search by name or SKU...",
  [ADMIN_PAGE_TYPES.ORDERS]: "Search by order ID or customer...",
  [ADMIN_PAGE_TYPES.REVIEWS]: "Search by product or user...",
};

///////////////////////////////////////////////////////////////////////
// ====================== FILTER CONFIGURATIONS ====================== //
///////////////////////////////////////////////////////////////////////

// Users page filters
export const USER_FILTERS = [
  {
    key: "role",
    label: "All Roles",
    options: [
      { value: "", label: "All Roles" },
      { value: "user", label: "User" },
      { value: "admin", label: "Admin" },
    ],
  },
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "suspended", label: "Suspended" },
    ],
  },
];

// Products page filters
export const PRODUCT_FILTERS = [
  {
    key: "category_id",
    label: "All Categories",
    options: [{ value: "", label: "All Categories" }],
    dynamic: true, // Indicates options are loaded dynamically
  },
  {
    key: "is_active",
    label: "All Status",
    options: [
      { value: "", label: "All Status" },
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
  {
    key: "is_featured",
    label: "All Featured",
    options: [
      { value: "", label: "All Featured" },
      { value: "true", label: "Featured" },
      { value: "false", label: "Not Featured" },
    ],
  },
];

// Orders page filters
export const ORDER_FILTERS = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "", label: "All Statuses" },
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];

// Reviews page filters
export const REVIEW_FILTERS = [
  {
    key: "rating",
    label: "All Ratings",
    options: [
      { value: "", label: "All Ratings" },
      { value: "5", label: "5 Stars" },
      { value: "4", label: "4 Stars" },
      { value: "3", label: "3 Stars" },
      { value: "2", label: "2 Stars" },
      { value: "1", label: "1 Star" },
    ],
  },
  {
    key: "is_approved",
    label: "All Approval Status",
    options: [
      { value: "", label: "All Approval Status" },
      { value: "true", label: "Approved" },
      { value: "false", label: "Pending" },
    ],
  },
];

///////////////////////////////////////////////////////////////////////
// ====================== FILTER MAP BY PAGE ========================= //
///////////////////////////////////////////////////////////////////////

export const FILTERS_BY_PAGE = {
  [ADMIN_PAGE_TYPES.USERS]: USER_FILTERS,
  [ADMIN_PAGE_TYPES.PRODUCTS]: PRODUCT_FILTERS,
  [ADMIN_PAGE_TYPES.ORDERS]: ORDER_FILTERS,
  [ADMIN_PAGE_TYPES.REVIEWS]: REVIEW_FILTERS,
};

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN SEARCH BAR CONSTANTS ================ //
///////////////////////////////////////////////////////////////////////
