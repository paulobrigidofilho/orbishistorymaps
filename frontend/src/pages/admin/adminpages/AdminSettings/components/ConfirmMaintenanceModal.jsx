///////////////////////////////////////////////////////////////////////
// ================ CONFIRM MAINTENANCE MODAL ====================== //
///////////////////////////////////////////////////////////////////////

// Modal component for confirming maintenance mode toggle
// Shows different messages based on the maintenance mode being enabled

//  ========== Module imports  ========== //
import React from "react";
import PropTypes from "prop-types";
import styles from "./ConfirmMaintenanceModal.module.css";

///////////////////////////////////////////////////////////////////////
// ================ MODAL CONFIGURATIONS =========================== //
///////////////////////////////////////////////////////////////////////

const MODE_CONFIG = {
  "site-wide": {
    icon: "warning",
    iconColor: "#e74c3c",
    title: "Enable Site-Wide Maintenance?",
    message: "This will make the entire site inaccessible to all users except administrators. Users will see a maintenance page on all routes.",
    warningList: [
      "All public pages will show maintenance message",
      "Users cannot browse, shop, or access their accounts",
      "Only admin pages will remain accessible",
      "Existing sessions will be unaffected but users cannot navigate",
    ],
    confirmText: "Enable Site-Wide Maintenance",
    confirmColor: "#e74c3c",
  },
  "shop-only": {
    icon: "store",
    iconColor: "#f39c12",
    title: "Enable Shop Maintenance?",
    message: "This will disable all shop functionality. Users can still browse Home, Gallery, and About Us pages.",
    warningList: [
      "Shop, Cart, Checkout, and Product pages will be unavailable",
      "Wishlist and Cart buttons will be disabled",
      "Home, Gallery, and About Us remain accessible",
      "Users cannot make purchases or manage their orders",
    ],
    confirmText: "Enable Shop Maintenance",
    confirmColor: "#f39c12",
  },
  "registration-only": {
    icon: "person_add_disabled",
    iconColor: "#9b59b6",
    title: "Disable User Registration?",
    message: "This will prevent new users from registering. Existing users can still log in and use the site normally.",
    warningList: [
      "New user registration will be blocked",
      "Registration links will redirect to maintenance page",
      "Existing users can still log in normally",
      "All other site functionality remains unchanged",
    ],
    confirmText: "Disable Registration",
    confirmColor: "#9b59b6",
  },
  "off": {
    icon: "check_circle",
    iconColor: "#27ae60",
    title: "Disable Maintenance Mode?",
    message: "This will restore full site functionality for all users.",
    warningList: [
      "All pages will become accessible",
      "Shop functionality will be restored",
      "User registration will be enabled",
      "Normal site operations will resume",
    ],
    confirmText: "Disable Maintenance Mode",
    confirmColor: "#27ae60",
  },
};

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

/**
 * ConfirmMaintenanceModal - Confirmation modal for maintenance mode changes
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.targetMode - The mode being switched to
 * @param {string} props.currentMode - The current maintenance mode
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {boolean} props.isLoading - Whether the action is in progress
 */
export default function ConfirmMaintenanceModal({
  isOpen,
  targetMode,
  currentMode,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  const config = MODE_CONFIG[targetMode] || MODE_CONFIG["off"];

  ///////////////////////////////////////////////////////////////////////
  // =================== HANDLERS ===================================== //
  ///////////////////////////////////////////////////////////////////////

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm(targetMode);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header with icon */}
        <div className={styles.header}>
          <div 
            className={styles.iconWrapper}
            style={{ backgroundColor: `${config.iconColor}15` }}
          >
            <i 
              className="material-icons" 
              style={{ color: config.iconColor }}
            >
              {config.icon}
            </i>
          </div>
          <h2 className={styles.title}>{config.title}</h2>
        </div>

        {/* Message */}
        <p className={styles.message}>{config.message}</p>

        {/* Warning list */}
        <div className={styles.warningBox}>
          <h4 className={styles.warningTitle}>What will happen:</h4>
          <ul className={styles.warningList}>
            {config.warningList.map((item, index) => (
              <li key={index}>
                <i className="material-icons">arrow_right</i>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Current mode indicator */}
        {currentMode && currentMode !== "off" && targetMode !== "off" && (
          <div className={styles.currentModeNote}>
            <i className="material-icons">info</i>
            <span>
              Note: This will replace the current "{currentMode}" maintenance mode.
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            style={{ backgroundColor: config.confirmColor }}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              config.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================ //
///////////////////////////////////////////////////////////////////////

ConfirmMaintenanceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  targetMode: PropTypes.oneOf(["off", "site-wide", "shop-only", "registration-only"]),
  currentMode: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
