///////////////////////////////////////////////////////////////////////
// ======================= SHOP CONSTANTS ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains constant values used throughout the shop module

// ===== API Base URL ===== //
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===== API Endpoints ===== //
export const SHOP_ENDPOINTS = {
  GET_PRODUCTS: `${API_BASE}/api/products`,
  GET_PRODUCT: (identifier) => `${API_BASE}/api/products/${identifier}`,
  GET_CART: `${API_BASE}/api/cart`,
  ADD_TO_CART: `${API_BASE}/api/cart/items`,
  UPDATE_CART_ITEM: (cartItemId) => `${API_BASE}/api/cart/items/${cartItemId}`,
  REMOVE_CART_ITEM: (cartItemId) => `${API_BASE}/api/cart/items/${cartItemId}`,
  CLEAR_CART: (cartId) => `${API_BASE}/api/cart/${cartId}`,
  MERGE_CART: `${API_BASE}/api/cart/merge`,
};

// ===== Product Categories ===== //
export const PRODUCT_CATEGORIES = [
  "Maps",
  "Prints",
  "Books",
  "Accessories",
  "Digital",
];

// ===== Price Filters ===== //
export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: null },
];

// ===== Sort Options ===== //
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
  { value: "newest", label: "Newest" },
];
