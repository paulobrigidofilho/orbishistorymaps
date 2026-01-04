///////////////////////////////////////////////////////////////////////
// =============== REGISTRATION MAINTENANCE GUARD ================== //
///////////////////////////////////////////////////////////////////////

// This guard component checks for registration maintenance mode
// Redirects to maintenance page if registration is disabled

//  ========== Module imports  ========== //
import React from "react";
import { Navigate } from "react-router-dom";

//  ========== Context imports  ========== //
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

///////////////////////////////////////////////////////////////////////
// =============== REGISTRATION MAINTENANCE GUARD ================== //
///////////////////////////////////////////////////////////////////////

export default function RegistrationMaintenanceGuard({ children }) {
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

  // Check for registration-only maintenance mode
  if (settings?.maintenance_mode === "registration-only") {
    return <Navigate to="/maintenance?mode=registration-only" replace />;
  }

  return children;
}
