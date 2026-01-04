///////////////////////////////////////////////////////////////////////
// =================== SITE MAINTENANCE GUARD ====================== //
///////////////////////////////////////////////////////////////////////

// This guard component checks for site-wide maintenance mode
// Redirects to maintenance page if site is in maintenance

//  ========== Module imports  ========== //
import React from "react";
import { Navigate } from "react-router-dom";

//  ========== Context imports  ========== //
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

///////////////////////////////////////////////////////////////////////
// =================== SITE MAINTENANCE GUARD ====================== //
///////////////////////////////////////////////////////////////////////

export default function SiteMaintenanceGuard({ children }) {
  const { settings, loading } = useSettings();
  const { user } = useAuth();

  // Allow admins to bypass maintenance
  if (user?.role === "admin") {
    return children;
  }

  // Show loading state while fetching settings
  if (loading) {
    return null;
  }

  // Check for site-wide maintenance mode
  if (settings?.maintenance_mode === "site-wide") {
    return <Navigate to="/maintenance?mode=site-wide" replace />;
  }

  return children;
}
