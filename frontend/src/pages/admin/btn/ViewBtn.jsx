///////////////////////////////////////////////////////////////////////
// ====================== VIEW BUTTON COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// Reusable View button for Admin components
// Used in: AdminReviews table

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= VIEW BUTTON ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * View Button Component
 * @param {function} onClick - Click handler function
 * @param {string} title - Tooltip text (default: "View")
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "View")
 * @param {string} className - Additional CSS classes
 */
export default function ViewBtn({
  onClick,
  title = "View",
  disabled = false,
  size = "md",
  children = "View",
  className = "",
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${styles.btn} ${styles.viewBtn} ${styles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
