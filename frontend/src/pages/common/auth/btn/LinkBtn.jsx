///////////////////////////////////////////////////////////////////////
// ====================== LINK BUTTON COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// Reusable NavLink button for Auth navigation
// Uses conditional rendering for different link variants (DRY principle)
// Used in: LoginModal, RegisterForm, ForgotPassword, SetNewPassword

//  ========== Module imports  ========== //
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../Auth.module.css";

///////////////////////////////////////////////////////////////////////
// ========================== LINK BUTTON ============================ //
///////////////////////////////////////////////////////////////////////

/**
 * Link Button Component
 * @param {string} to - Navigation path
 * @param {function} onClick - Click handler function
 * @param {string} variant - Link variant: "forgot" | "register" | "login" | "newResetLink" (default: "register")
 * @param {string} children - Link text (overrides default)
 * @param {string} prefix - Text before the link
 * @param {string} className - Additional CSS classes
 */
export default function LinkBtn({
  to,
  onClick,
  variant = "register",
  children,
  prefix,
  className = "",
  ...props
}) {
  // ===== Determine link style based on variant ===== //
  const getContainerStyle = () => {
    switch (variant) {
      case "forgot":
        return styles.forgotPasswordLink;
      case "newResetLink":
      case "register":
      case "login":
      default:
        return styles.registerLink;
    }
  };

  // ===== Determine default path based on variant ===== //
  const getDefaultPath = () => {
    switch (variant) {
      case "forgot":
      case "newResetLink":
        return "/forgot-password";
      case "register":
        return "/register";
      case "login":
      default:
        return "/";
    }
  };

  // ===== Determine default text based on variant ===== //
  const getDefaultText = () => {
    switch (variant) {
      case "forgot":
        return "Forgot Password?";
      case "newResetLink":
        return "Request a new reset link";
      case "register":
        return "Register here";
      case "login":
      default:
        return "Back to Login";
    }
  };

  // ===== Determine default prefix based on variant ===== //
  const getDefaultPrefix = () => {
    switch (variant) {
      case "register":
        return "Not a user? ";
      case "login":
        return "Remember your password? ";
      default:
        return "";
    }
  };

  const linkPath = to || getDefaultPath();
  const linkText = children || getDefaultText();
  const linkPrefix = prefix !== undefined ? prefix : getDefaultPrefix();

  return (
    <div className={`${getContainerStyle()} ${className}`}>
      {linkPrefix}
      <NavLink to={linkPath} onClick={onClick} {...props}>
        {linkText}
      </NavLink>
    </div>
  );
}
