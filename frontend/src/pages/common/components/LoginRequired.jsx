///////////////////////////////////////////////////////////////////////
// =================== LOGIN REQUIRED COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component displays a prompt to log in when the user is not authenticated
// Used across pages that require authentication: MyOrders, MyReviews, Wishlist

///////////////////////////////////////////////////////////////////////
// =================== MODULE IMPORTS =============================== //
///////////////////////////////////////////////////////////////////////

import React from "react";
import PropTypes from "prop-types";
import styles from "./LoginRequired.module.css";

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT CONFIGURATIONS ======================= //
///////////////////////////////////////////////////////////////////////

const DEFAULT_CONFIG = {
  icon: "lock",
  title: "Please Log In",
  message: "You need to be logged in to view this content.",
  buttonText: "Sign In",
  iconColor: "#3498db",
};

///////////////////////////////////////////////////////////////////////
// =================== COMPONENT ==================================== //
///////////////////////////////////////////////////////////////////////

/**
 * LoginRequired - A reusable component for pages requiring authentication
 * @param {Object} props - Component props
 * @param {string} props.icon - Material icon name (optional)
 * @param {string} props.title - Title text (optional)
 * @param {string} props.message - Description message (optional)
 * @param {string} props.buttonText - Button text (optional)
 * @param {Function} props.onLoginClick - Callback when login button is clicked
 * @param {string} props.iconColor - Color for the icon (optional)
 * @param {React.ReactNode} props.children - Additional content (optional)
 * @returns {React.ReactElement} The login required component
 */
export default function LoginRequired({
  icon = DEFAULT_CONFIG.icon,
  title = DEFAULT_CONFIG.title,
  message = DEFAULT_CONFIG.message,
  buttonText = DEFAULT_CONFIG.buttonText,
  onLoginClick,
  iconColor = DEFAULT_CONFIG.iconColor,
  children,
}) {
  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW ==================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.loginRequiredContainer}>
      <div className={styles.iconWrapper}>
        <i 
          className="material-icons" 
          style={{ fontSize: "4rem", color: iconColor }}
        >
          {icon}
        </i>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {children}
      <button 
        onClick={onLoginClick} 
        className={styles.loginButton}
      >
        {buttonText}
      </button>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

LoginRequired.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  onLoginClick: PropTypes.func.isRequired,
  iconColor: PropTypes.string,
  children: PropTypes.node,
};
