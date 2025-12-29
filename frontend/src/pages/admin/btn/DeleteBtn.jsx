///////////////////////////////////////////////////////////////////////
// ===================== DELETE BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Delete button for Admin components
// Used in: AdminProducts, AdminUsers, AdminOrders tables

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ======================== DELETE BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Delete Button Component
 * @param {function} onClick - Click handler function
 * @param {string} title - Tooltip text (default: "Delete")
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Delete")
 * @param {string} className - Additional CSS classes
 */
export default function DeleteBtn({
  onClick,
  title = "Delete",
  disabled = false,
  size = "md",
  children = "Delete",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.deleteBtn} ${styles[size]} ${
        disabled ? styles.disabled : ""
      } ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
