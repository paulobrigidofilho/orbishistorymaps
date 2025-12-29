///////////////////////////////////////////////////////////////////////
// ====================== EDIT BUTTON COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable Edit button for Admin components
// Used in: AdminProducts, AdminUsers, AdminOrders tables

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= EDIT BUTTON ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Edit Button Component
 * @param {function} onClick - Click handler function
 * @param {string} title - Tooltip text (default: "Edit")
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Edit")
 * @param {string} className - Additional CSS classes
 */
export default function EditBtn({
  onClick,
  title = "Edit",
  disabled = false,
  size = "md",
  children = "Edit",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.editBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
