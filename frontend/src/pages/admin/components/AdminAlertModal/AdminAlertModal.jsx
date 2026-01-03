///////////////////////////////////////////////////////////////////////
// ================ ADMIN ALERT MODAL COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// Custom alert/confirm modal for Admin interface ONLY
// Security isolated from User-facing modals
// Styled differently to distinguish admin operations

//  ========== Module imports  ========== //
import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./AdminAlertModal.module.css";

//  ========== Constants imports  ========== //
import {
  ADMIN_ALERT_MODAL_DEFAULTS,
  ADMIN_ALERT_MODAL_ICONS,
  ADMIN_ALERT_MODAL_COLORS,
  ADMIN_ALERT_MODAL_TYPES,
} from "../../constants/adminAlertModalConstants";

///////////////////////////////////////////////////////////////////////
// ================ ADMIN ALERT MODAL COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

/**
 * AdminAlertModal - Custom modal for admin operations
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onConfirm - Callback when confirm button is clicked
 * @param {string} props.type - Modal type: 'confirm' | 'alert' | 'warning' | 'success' | 'error' | 'info' | 'danger'
 * @param {string} props.title - Modal title text
 * @param {string} props.message - Modal body message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {boolean} props.showCancel - Whether to show cancel button
 * @param {string} props.icon - Material icon name (optional, defaults based on type)
 * @param {boolean} props.isLoading - Whether the action is in progress
 * @returns {React.ReactElement|null} The admin alert modal component
 */
export default function AdminAlertModal({
  isOpen,
  onClose,
  onConfirm,
  type = ADMIN_ALERT_MODAL_DEFAULTS.type,
  title = ADMIN_ALERT_MODAL_DEFAULTS.title,
  message = ADMIN_ALERT_MODAL_DEFAULTS.message,
  confirmText = ADMIN_ALERT_MODAL_DEFAULTS.confirmText,
  cancelText = ADMIN_ALERT_MODAL_DEFAULTS.cancelText,
  showCancel = ADMIN_ALERT_MODAL_DEFAULTS.showCancel,
  icon,
  isLoading = false,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= DERIVED VALUES ======================== //
  ///////////////////////////////////////////////////////////////////////

  const modalIcon = icon || ADMIN_ALERT_MODAL_ICONS[type] || ADMIN_ALERT_MODAL_DEFAULTS.icon;
  const modalColor = ADMIN_ALERT_MODAL_COLORS[type] || ADMIN_ALERT_MODAL_COLORS[ADMIN_ALERT_MODAL_TYPES.CONFIRM];

  ///////////////////////////////////////////////////////////////////////
  // ========================= EVENT HANDLERS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  }, [onConfirm, onClose, isLoading]);

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [onClose, isLoading]);

  const handleOverlayClick = useCallback((e) => {
    if (isLoading) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleKeyDown = useCallback((e) => {
    if (isLoading) return;
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      handleConfirm();
    }
  }, [onClose, handleConfirm, isLoading]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOKS ====================== //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= RENDER GUARD ========================== //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div 
      className={styles.overlay} 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-alert-modal-title"
    >
      <div className={styles.modal}>
        {/* Admin Badge */}
        <div className={styles.adminBadge}>
          <i className="material-icons">admin_panel_settings</i>
          <span>Admin Action</span>
        </div>

        {/* Icon Header */}
        <div 
          className={styles.iconWrapper}
          style={{ backgroundColor: `${modalColor}15`, borderColor: `${modalColor}30` }}
        >
          <i 
            className="material-icons" 
            style={{ color: modalColor }}
          >
            {modalIcon}
          </i>
        </div>

        {/* Content */}
        <h2 id="admin-alert-modal-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>

        {/* Actions */}
        <div className={styles.actions}>
          {showCancel && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`${styles.confirmBtn} ${styles[type]}`}
            onClick={handleConfirm}
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? "#9ca3af" : modalColor }}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================== //
///////////////////////////////////////////////////////////////////////

AdminAlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  type: PropTypes.oneOf(Object.values(ADMIN_ALERT_MODAL_TYPES)),
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  showCancel: PropTypes.bool,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
};
