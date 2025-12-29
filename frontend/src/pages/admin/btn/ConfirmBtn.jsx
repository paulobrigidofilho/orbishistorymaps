///////////////////////////////////////////////////////////////////////
// ==================== CONFIRM BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Confirm/Danger button for Admin delete modals
// Used in: DeleteProductModal, DeleteUserModal

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ======================== CONFIRM BUTTON =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Confirm Button Component (Danger/Delete confirmation)
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state (shows loading text)
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Confirm")
 * @param {string} loadingText - Text to show when loading (default: "Processing...")
 * @param {string} className - Additional CSS classes
 */
export default function ConfirmBtn({
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  children = "Confirm",
  loadingText = "Processing...",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.confirmBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
