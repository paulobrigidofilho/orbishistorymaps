///////////////////////////////////////////////////////////////////////
// ====================== MAINTENANCE PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page is displayed when the site is in maintenance mode
// Shows appropriate message based on maintenance type

//  ========== Module imports  ========== //
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./MaintenancePage.module.css";

///////////////////////////////////////////////////////////////////////
// ====================== MAINTENANCE MODES CONFIG =================== //
///////////////////////////////////////////////////////////////////////

const MAINTENANCE_CONFIGS = {
  "site-wide": {
    icon: "engineering",
    title: "Site Under Maintenance",
    message: "We're currently performing scheduled maintenance. Please check back soon.",
    buttonText: "Try Again",
    color: "#ef4444",
  },
  "shop-only": {
    icon: "store",
    title: "Shop Under Maintenance",
    message: "Our shop is temporarily unavailable while we make improvements. Other parts of the site remain accessible.",
    buttonText: "Go to Home",
    redirectTo: "/",
    color: "#f97316",
  },
  "registration-only": {
    icon: "person_add_disabled",
    title: "Registration Temporarily Disabled",
    message: "New user registration is currently disabled. Please try again later.",
    buttonText: "Go to Home",
    redirectTo: "/",
    color: "#eab308",
  },
};

const DEFAULT_CONFIG = {
  icon: "build",
  title: "Maintenance Mode",
  message: "This page is currently unavailable. Please try again later.",
  buttonText: "Go to Home",
  redirectTo: "/",
  color: "#6b7280",
};

///////////////////////////////////////////////////////////////////////
// ====================== MAINTENANCE PAGE =========================== //
///////////////////////////////////////////////////////////////////////

export default function MaintenancePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const mode = searchParams.get("mode");
  const config = MAINTENANCE_CONFIGS[mode] || DEFAULT_CONFIG;

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleButtonClick = () => {
    if (config.redirectTo) {
      navigate(config.redirectTo);
    } else {
      window.location.reload();
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.maintenancePage}>
      <div className={styles.content}>
        <div 
          className={styles.iconContainer} 
          style={{ backgroundColor: `${config.color}15` }}
        >
          <i 
            className="material-icons" 
            style={{ color: config.color }}
          >
            {config.icon}
          </i>
        </div>

        <h1 className={styles.title}>{config.title}</h1>
        <p className={styles.message}>{config.message}</p>

        <button 
          className={styles.button}
          onClick={handleButtonClick}
          style={{ backgroundColor: config.color }}
        >
          {config.buttonText}
        </button>

        <div className={styles.footer}>
          <p>Need help? Contact us at <a href="mailto:support@orbis.com">support@orbis.com</a></p>
        </div>
      </div>
    </div>
  );
}
