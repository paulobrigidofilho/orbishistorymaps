///////////////////////////////////////////////////////////////////////
// ====================== CLOSE BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Close button (X) for Admin modals
// Used in: All modal headers

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= CLOSE BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Close Button Component (X button for modals)
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 */
export default function CloseBtn({
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.closeBtn} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Close"
      {...props}
    >
      ×
    </button>
  );
}
