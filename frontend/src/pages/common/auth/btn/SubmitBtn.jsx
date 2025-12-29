///////////////////////////////////////////////////////////////////////
// ===================== SUBMIT BUTTON COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable Submit button for Auth forms (Login, Register, Reset, Save)
// Uses conditional rendering for different button variants (DRY principle)
// Used in: LoginModal, RegisterForm, Profile, ForgotPassword, SetNewPassword

//  ========== Module imports  ========== //
import React from "react";
import styles from "../Auth.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= SUBMIT BUTTON =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Submit Button Component
 * @param {function} onClick - Click handler function (optional if type="submit")
 * @param {string} type - Button type: "button" | "submit" (default: "submit")
 * @param {boolean} disabled - Disabled state
 * @param {boolean} loading - Loading state (shows loading text)
 * @param {string} variant - Button variant: "login" | "register" | "submit" | "home" (default: "submit")
 * @param {string} children - Button text
 * @param {string} loadingText - Text to show when loading
 * @param {string} className - Additional CSS classes
 */
export default function SubmitBtn({
  onClick,
  type = "submit",
  disabled = false,
  loading = false,
  variant = "submit",
  children,
  loadingText,
  className = "",
  ...props
}) {
  // ===== Determine button style based on variant ===== //
  const getButtonStyle = () => {
    switch (variant) {
      case "login":
        return styles.loginButton;
      case "register":
        return styles.registerButton;
      case "home":
        return styles.homeButton;
      case "submit":
      default:
        return styles.submitButton;
    }
  };

  // ===== Determine default text based on variant ===== //
  const getDefaultText = () => {
    switch (variant) {
      case "login":
        return "Log In";
      case "register":
        return "Register";
      case "home":
        return "Return Home";
      case "submit":
      default:
        return "Save Changes";
    }
  };

  // ===== Determine default loading text based on variant ===== //
  const getDefaultLoadingText = () => {
    switch (variant) {
      case "login":
        return "Logging in...";
      case "register":
        return "Registering...";
      default:
        return "Saving...";
    }
  };

  const buttonText = children || getDefaultText();
  const buttonLoadingText = loadingText || getDefaultLoadingText();

  return (
    <button
      type={type}
      className={`${getButtonStyle()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? buttonLoadingText : buttonText}
    </button>
  );
}
