///////////////////////////////////////////////////////////////////////
// ======================= CART CONSTANTS ============================ //
///////////////////////////////////////////////////////////////////////

// This file contains constant values used throughout the cart module

// ===== API Base URL ===== //
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===== Cart Messages ===== //
export const CART_MESSAGES = {
  EMPTY_CART: "Your cart is empty",
  ITEM_ADDED: "Item added to cart",
  ITEM_REMOVED: "Item removed from cart",
  ITEM_UPDATED: "Cart updated",
  CART_CLEARED: "Cart cleared",
  LOGIN_REQUIRED: "Please login to checkout",
};

// ===== Payment Methods ===== //
export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

// ===== Order Status ===== //
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};
