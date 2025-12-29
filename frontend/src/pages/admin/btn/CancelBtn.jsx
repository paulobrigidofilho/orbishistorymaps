///////////////////////////////////////////////////////////////////////
// ===================== CANCEL BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Cancel button for Admin modals and forms
// Used in: ProductEditModal, UserEditModal, DeleteModals

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ======================== CANCEL BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Cancel Button Component
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Cancel")
 * @param {string} className - Additional CSS classes
 */
export default function CancelBtn({
  onClick,
  disabled = false,
  size = "md",
  children = "Cancel",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.cancelBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
