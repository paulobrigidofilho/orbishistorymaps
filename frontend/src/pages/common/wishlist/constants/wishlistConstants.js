///////////////////////////////////////////////////////////////////////
// ==================== WISHLIST CONSTANTS =========================== //
///////////////////////////////////////////////////////////////////////

// This file contains constant values used throughout the wishlist module

// ===== API Base URL ===== //
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===== API Endpoints ===== //
export const WISHLIST_ENDPOINTS = {
  GET_WISHLIST: `${API_BASE}/api/wishlist`,
  ADD_TO_WISHLIST: `${API_BASE}/api/wishlist/items`,
  REMOVE_FROM_WISHLIST: (productId) => `${API_BASE}/api/wishlist/items/${productId}`,
};

// ===== Success Messages ===== //
export const WISHLIST_SUCCESS_MESSAGES = {
  ITEM_ADDED: "Item added to wishlist",
  ITEM_REMOVED: "Item removed from wishlist",
};

// ===== Error Messages ===== //
export const WISHLIST_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load wishlist",
  ADD_FAILED: "Failed to add item to wishlist",
  REMOVE_FAILED: "Failed to remove item from wishlist",
  ALREADY_EXISTS: "Item already in wishlist",
};
