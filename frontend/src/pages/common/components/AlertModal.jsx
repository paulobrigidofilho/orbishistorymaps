///////////////////////////////////////////////////////////////////////
// =================== ALERT MODAL COMPONENT ========================= //
///////////////////////////////////////////////////////////////////////

// Custom alert/confirm modal to replace native browser dialogs
// Used for user-facing interactions (cart, reviews, wishlist, etc.)
// Security isolated from Admin modals

//  ========== Module imports  ========== //
import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./AlertModal.module.css";

//  ========== Constants imports  ========== //
import {
  ALERT_MODAL_DEFAULTS,
  ALERT_MODAL_ICONS,
  ALERT_MODAL_COLORS,
  ALERT_MODAL_TYPES,
} from "../constants/alertModalConstants";

///////////////////////////////////////////////////////////////////////
// =================== ALERT MODAL COMPONENT ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * AlertModal - Custom modal to replace window.alert and window.confirm
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onConfirm - Callback when confirm button is clicked
 * @param {string} props.type - Modal type: 'confirm' | 'alert' | 'warning' | 'success' | 'error' | 'info'
 * @param {string} props.title - Modal title text
 * @param {string} props.message - Modal body message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {boolean} props.showCancel - Whether to show cancel button
 * @param {string} props.icon - Material icon name (optional, defaults based on type)
 * @returns {React.ReactElement|null} The alert modal component
 */
export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  type = ALERT_MODAL_DEFAULTS.type,
  title = ALERT_MODAL_DEFAULTS.title,
  message = ALERT_MODAL_DEFAULTS.message,
  confirmText = ALERT_MODAL_DEFAULTS.confirmText,
  cancelText = ALERT_MODAL_DEFAULTS.cancelText,
  showCancel = ALERT_MODAL_DEFAULTS.showCancel,
  icon,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= DERIVED VALUES ======================== //
  ///////////////////////////////////////////////////////////////////////

  const modalIcon = icon || ALERT_MODAL_ICONS[type] || ALERT_MODAL_DEFAULTS.icon;
  const modalColor = ALERT_MODAL_COLORS[type] || ALERT_MODAL_COLORS[ALERT_MODAL_TYPES.CONFIRM];

  ///////////////////////////////////////////////////////////////////////
  // ========================= EVENT HANDLERS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      handleConfirm();
    }
  }, [onClose, handleConfirm]);

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
      aria-labelledby="alert-modal-title"
    >
      <div className={styles.modal}>
        {/* Icon Header */}
        <div 
          className={styles.iconWrapper}
          style={{ backgroundColor: `${modalColor}15` }}
        >
          <i 
            className="material-icons" 
            style={{ color: modalColor }}
          >
            {modalIcon}
          </i>
        </div>

        {/* Content */}
        <h2 id="alert-modal-title" className={styles.title}>
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
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={`${styles.confirmBtn} ${styles[type]}`}
            onClick={handleConfirm}
            style={{ backgroundColor: modalColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================== //
///////////////////////////////////////////////////////////////////////

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  type: PropTypes.oneOf(Object.values(ALERT_MODAL_TYPES)),
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  showCancel: PropTypes.bool,
  icon: PropTypes.string,
};
