///////////////////////////////////////////////////////////////////////
// =================== SHOP MAINTENANCE GUARD ====================== //
///////////////////////////////////////////////////////////////////////

// This guard component checks for shop maintenance mode
// Redirects to maintenance page if shop is under maintenance

//  ========== Module imports  ========== //
import React from "react";
import { Navigate } from "react-router-dom";

//  ========== Context imports  ========== //
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

///////////////////////////////////////////////////////////////////////
// =================== SHOP MAINTENANCE GUARD ====================== //
///////////////////////////////////////////////////////////////////////

export default function ShopMaintenanceGuard({ children }) {
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

  // Check for site-wide or shop-only maintenance mode
  if (settings?.maintenance_mode === "site-wide") {
    return <Navigate to="/maintenance?mode=site-wide" replace />;
  }

  if (settings?.maintenance_mode === "shop-only") {
    return <Navigate to="/maintenance?mode=shop-only" replace />;
  }

  return children;
}
