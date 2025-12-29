///////////////////////////////////////////////////////////////////////
// ======================= ADD BUTTON COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable Add/Create button for Admin components
// Used in: AdminProducts, AdminUsers headers

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// =========================== ADD BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Add Button Component
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "lg")
 * @param {string} children - Button text (default: "Add New")
 * @param {string} className - Additional CSS classes
 */
export default function AddBtn({
  onClick,
  disabled = false,
  size = "lg",
  children = "Add New",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.addBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
