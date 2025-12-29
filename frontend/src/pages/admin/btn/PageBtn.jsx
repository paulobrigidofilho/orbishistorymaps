///////////////////////////////////////////////////////////////////////
// ======================= PAGE BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Pagination button for Admin tables
// Used in: AdminProducts, AdminUsers, AdminOrders pagination

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ========================== PAGE BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Page Button Component (Pagination)
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {string} children - Button text (default: "Next")
 * @param {string} className - Additional CSS classes
 */
export default function PageBtn({
  onClick,
  disabled = false,
  children = "Next",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.pageBtn} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
