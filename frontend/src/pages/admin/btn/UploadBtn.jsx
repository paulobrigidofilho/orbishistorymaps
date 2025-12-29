///////////////////////////////////////////////////////////////////////
// ===================== UPLOAD BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Upload button for Admin image uploads
// Used in: ProductEditModal, UserEditModal

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminButtons.module.css";

///////////////////////////////////////////////////////////////////////
// ======================== UPLOAD BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Upload Button Component
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state (shows loading text)
 * @param {string} size - Button size: "sm" | "md" | "lg" (default: "md")
 * @param {string} children - Button text (default: "Upload")
 * @param {string} loadingText - Text to show when loading (default: "Uploading...")
 * @param {string} className - Additional CSS classes
 */
export default function UploadBtn({
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  children = "Upload",
  loadingText = "Uploading...",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.uploadBtn} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
