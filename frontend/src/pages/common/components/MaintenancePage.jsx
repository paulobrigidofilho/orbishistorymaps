///////////////////////////////////////////////////////////////////////
// =================== MAINTENANCE PAGE COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component displays a maintenance page when the site is in maintenance mode
// Shows a message and a refresh button for users to check if maintenance is over

//  ========== Module imports  ========== //
import React from "react";
import PropTypes from "prop-types";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./MaintenancePage.module.css";

//  ========== Constants imports  ========== //
import {
  MAINTENANCE_PAGE_DEFAULTS,
  MAINTENANCE_MODE_CONFIGS,
  MAINTENANCE_MODES,
} from "../constants/maintenancePageConstants";

///////////////////////////////////////////////////////////////////////
// =================== COMPONENT ==================================== //
///////////////////////////////////////////////////////////////////////

/**
 * MaintenancePage - Displays when site/shop/registration is under maintenance
 * @param {Object} props - Component props
 * @param {string} props.mode - Maintenance mode: 'site-wide' | 'shop-only' | 'registration-only'
 * @param {string} props.icon - Material icon name (optional)
 * @param {string} props.title - Title text (optional)
 * @param {string} props.message - Description message (optional)
 * @param {string} props.buttonText - Button text (optional)
 * @param {string} props.iconColor - Color for the icon (optional)
 * @param {React.ReactNode} props.children - Additional content (optional)
 * @returns {React.ReactElement} The maintenance page component
 */
export default function MaintenancePage({
  mode: propMode,
  icon,
  title,
  message,
  buttonText = MAINTENANCE_PAGE_DEFAULTS.buttonText,
  iconColor,
  children,
}) {
  ///////////////////////////////////////////////////////////////////////
  // =================== HOOKS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get mode from URL params or props
  const mode = propMode || searchParams.get("mode") || MAINTENANCE_MODES.SITE_WIDE;

  ///////////////////////////////////////////////////////////////////////
  // =================== CONFIGURATION BY MODE ======================== //
  ///////////////////////////////////////////////////////////////////////

  const getConfigByMode = () => {
    const modeConfig = MAINTENANCE_MODE_CONFIGS[mode] || MAINTENANCE_MODE_CONFIGS[MAINTENANCE_MODES.SITE_WIDE];
    
    return {
      icon: icon || modeConfig.icon,
      title: title || modeConfig.title,
      message: message || modeConfig.message,
      iconColor: iconColor || modeConfig.iconColor,
    };
  };

  const config = getConfigByMode();

  ///////////////////////////////////////////////////////////////////////
  // =================== HANDLERS ===================================== //
  ///////////////////////////////////////////////////////////////////////

  const handleRefresh = () => {
    window.location.reload();
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.maintenanceContainer}>
      <div className={styles.maintenanceCard}>
        <div className={styles.iconWrapper}>
          <i 
            className="material-icons" 
            style={{ fontSize: "4rem", color: config.iconColor }}
          >
            {config.icon}
          </i>
        </div>
        <h1 className={styles.title}>{config.title}</h1>
        <p className={styles.message}>{config.message}</p>
        {children}
        <button 
          className={styles.refreshButton}
          onClick={handleRefresh}
        >
          <i className="material-icons">refresh</i>
          {buttonText}
        </button>
        <p className={styles.subtext}>
          We apologize for any inconvenience. Thank you for your patience.
        </p>
        {/* Subtle admin login link */}
        <button 
          className={styles.adminLink}
          onClick={() => navigate("/admin/login")}
        >
          Administrator Access
        </button>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================ //
///////////////////////////////////////////////////////////////////////

MaintenancePage.propTypes = {
  mode: PropTypes.oneOf(["site-wide", "shop-only", "registration-only"]),
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  iconColor: PropTypes.string,
  children: PropTypes.node,
};
