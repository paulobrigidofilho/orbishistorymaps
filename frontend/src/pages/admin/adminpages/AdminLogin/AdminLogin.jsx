///////////////////////////////////////////////////////////////////////
// ===================== ADMIN LOGIN PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// This component provides a standalone login page for admins
// Accessible during maintenance mode, only allows admin users

//  ========== Module imports  ========== //
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

//  ========== Context imports  ========== //
import { useAuth } from "../../../common/context/AuthContext";
import { useSettings } from "../../../common/context/SettingsContext";

//  ========== Service imports  ========== //
import axios from "axios";

///////////////////////////////////////////////////////////////////////
// =================== ADMIN LOGIN PAGE ============================ //
///////////////////////////////////////////////////////////////////////

export default function AdminLogin() {
  ///////////////////////////////////////////////////////////////////////
  // =================== STATE VARIABLES ============================= //
  ///////////////////////////////////////////////////////////////////////

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // Check if site is in any maintenance mode
  const isMaintenanceActive = settings?.maintenance_mode && settings.maintenance_mode !== "off";

  ///////////////////////////////////////////////////////////////////////
  // =================== HANDLERS ==================================== //
  ///////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // Check if user is admin
      if (user?.role !== "admin") {
        // Log out the non-admin user immediately
        await logout();
        
        // Show appropriate error message
        if (isMaintenanceActive) {
          setError("Only administrators can log in during maintenance mode.");
        } else {
          setError("This login page is for administrators only. Please use the main site to log in.");
        }
        setLoading(false);
        return;
      }

      // Admin login successful - redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW =================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.adminLoginCard}>
        {/* Header */}
        <div className={styles.header}>
          <i className="material-icons" style={{ fontSize: "3rem", color: "#667eea" }}>
            admin_panel_settings
          </i>
          <h1 className={styles.title}>Admin Login</h1>
          {isMaintenanceActive && (
            <div className={styles.maintenanceBadge}>
              <i className="material-icons">build</i>
              <span>Maintenance Mode Active</span>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              <i className="material-icons">error_outline</i>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <i className="material-icons">email</i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <i className="material-icons">lock</i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={styles.input}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="material-icons spinning">sync</i>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <i className="material-icons">login</i>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            This page is for administrators only.
          </p>
          {!isMaintenanceActive && (
            <button
              onClick={() => navigate("/")}
              className={styles.backLink}
            >
              <i className="material-icons">arrow_back</i>
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
