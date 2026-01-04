///////////////////////////////////////////////////////////////////////
// ===================== CLOSE BUTTON COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable Close/X button for Auth modals
// Used in: LoginModal

//  ========== Module imports  ========== //
import React from "react";
import styles from "../Auth.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= CLOSE BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Close Button Component
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
      className={`${styles.closeButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Close"
      {...props}
    >
      ×
    </button>
  );
}
