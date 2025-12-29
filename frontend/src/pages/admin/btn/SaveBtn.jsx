///////////////////////////////////////////////////////////////////////
// ====================== SAVE BUTTON COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable Save/Submit button for Admin modals and forms
// Used in: ProductEditModal, UserEditModal, AdminSettings

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= SAVE BUTTON ============================= //
///////////////////////////////////////////////////////////////////////

/**
 * Save Button Component
 * @param {function} onClick - Click handler function (optional if type="submit")
 * @param {string} type - Button type: "button" | "submit" (default: "submit")
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state (shows loading text)
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Save Changes")
 * @param {string} loadingText - Text to show when loading (default: "Saving...")
 * @param {string} className - Additional CSS classes
 */
export default function SaveBtn({
  onClick,
  type = "submit",
  disabled = false,
  loading = false,
  size = "md",
  children = "Save Changes",
  loadingText = "Saving...",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles.saveBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
