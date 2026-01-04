///////////////////////////////////////////////////////////////////////
// ==================== MY ORDERS CONSTANTS ========================= //
///////////////////////////////////////////////////////////////////////

// This file contains constant values used throughout the my orders module
// Includes API endpoints, status configurations, and messages

///////////////////////////////////////////////////////////////////////
// =================== API CONFIGURATION ============================ //
///////////////////////////////////////////////////////////////////////

// ===== API Base URL ===== //
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===== API Endpoints ===== //
export const ORDER_ENDPOINTS = {
  GET_ORDERS: `${API_BASE}/api/orders`,
  GET_ORDER_DETAILS: (orderId) => `${API_BASE}/api/orders/${orderId}`,
  GET_ORDER_COUNT: `${API_BASE}/api/orders/count`,
  CANCEL_ORDER: (orderId) => `${API_BASE}/api/orders/${orderId}/cancel`,
};

///////////////////////////////////////////////////////////////////////
// =================== ORDER STATUS CONFIGURATION =================== //
///////////////////////////////////////////////////////////////////////

// ===== Order Status Labels & Colors ===== //
export const ORDER_STATUS = {
  pending: { label: "Pending", color: "#f39c12" },
  processing: { label: "Processing", color: "#3498db" },
  shipped: { label: "Shipped", color: "#9b59b6" },
  delivered: { label: "Delivered", color: "#27ae60" },
  cancelled: { label: "Cancelled", color: "#e74c3c" },
  refunded: { label: "Refunded", color: "#95a5a6" },
};

// ===== Payment Status Labels & Colors ===== //
export const PAYMENT_STATUS = {
  pending: { label: "Pending", color: "#f39c12" },
  paid: { label: "Paid", color: "#27ae60" },
  failed: { label: "Failed", color: "#e74c3c" },
  refunded: { label: "Refunded", color: "#95a5a6" },
};

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT VALUES =============================== //
///////////////////////////////////////////////////////////////////////

export const ORDER_DEFAULTS = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
  DEFAULT_STATUS: "pending",
};

///////////////////////////////////////////////////////////////////////
// =================== MESSAGE STRINGS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Success Messages ===== //
export const ORDER_SUCCESS_MESSAGES = {
  ORDERS_LOADED: "Orders loaded successfully",
  ORDER_CANCELLED: "Order cancelled successfully",
  ORDER_DETAILS_LOADED: "Order details loaded successfully",
};

// ===== Error Messages ===== //
export const ORDER_ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load orders",
  ORDER_NOT_FOUND: "Order not found",
  CANCEL_FAILED: "Failed to cancel order",
  INVALID_ORDER_ID: "Invalid order ID provided",
  NETWORK_ERROR: "Network error. Please check your connection.",
};
