///////////////////////////////////////////////////////////////////////
// =================== SETTINGS CONTEXT ============================ //
///////////////////////////////////////////////////////////////////////

// This context provides global site settings throughout the application
// Manages maintenance mode state and other global configurations

//  ========== Module imports  ========== //
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";

///////////////////////////////////////////////////////////////////////
// =================== CONTEXT CREATION ============================ //
///////////////////////////////////////////////////////////////////////

export const SettingsContext = createContext(null);

///////////////////////////////////////////////////////////////////////
// =================== DEFAULT VALUES ============================== //
///////////////////////////////////////////////////////////////////////

const DEFAULT_SETTINGS = {
  maintenance_mode: "off",
  maintenance_message: "We are currently performing scheduled maintenance. Please check back soon.",
};

///////////////////////////////////////////////////////////////////////
// =================== PROVIDER COMPONENT ========================== //
///////////////////////////////////////////////////////////////////////

export const SettingsProvider = ({ children }) => {
  ///////////////////////////////////////////////////////////////////////
  // =================== STATE VARIABLES ============================= //
  ///////////////////////////////////////////////////////////////////////

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // =================== FETCH SETTINGS ============================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchMaintenanceStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/settings/maintenance", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch maintenance status");
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSettings((prev) => ({
          ...prev,
          maintenance_mode: data.data.mode || "off",
          maintenance_message: data.data.message || DEFAULT_SETTINGS.maintenance_message,
          isMaintenanceActive: data.data.isActive || false,
          isSiteWide: data.data.isSiteWide || false,
          isShopOnly: data.data.isShopOnly || false,
          isRegistrationOnly: data.data.isRegistrationOnly || false,
        }));
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching maintenance status:", err);
      setError(err.message);
      // Keep default settings on error
    } finally {
      setLoading(false);
    }
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // =================== EFFECTS ===================================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch maintenance status on mount
  useEffect(() => {
    fetchMaintenanceStatus();
  }, [fetchMaintenanceStatus]);

  // Refresh settings periodically (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(fetchMaintenanceStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchMaintenanceStatus]);

  ///////////////////////////////////////////////////////////////////////
  // =================== HELPER FUNCTIONS ============================ //
  ///////////////////////////////////////////////////////////////////////

  // Check if a specific feature is disabled by maintenance
  const isFeatureDisabled = useCallback((feature) => {
    const mode = settings.maintenance_mode;
    
    if (mode === "off") return false;
    if (mode === "site-wide") return true;
    
    if (mode === "shop-only") {
      const shopFeatures = ["shop", "cart", "wishlist", "checkout", "orders", "products"];
      return shopFeatures.includes(feature.toLowerCase());
    }
    
    if (mode === "registration-only") {
      return feature.toLowerCase() === "registration";
    }
    
    return false;
  }, [settings.maintenance_mode]);

  // Check if current page should redirect to maintenance
  const shouldShowMaintenance = useCallback((path) => {
    const mode = settings.maintenance_mode;
    
    if (mode === "off") return false;
    
    // Admin routes never show maintenance
    if (path.startsWith("/admin")) return false;
    
    if (mode === "site-wide") return true;
    
    if (mode === "shop-only") {
      const shopPaths = ["/shop", "/cart", "/checkout", "/payment", "/wishlist", "/my-orders", "/order-confirmation"];
      return shopPaths.some((p) => path.startsWith(p));
    }
    
    if (mode === "registration-only") {
      return path === "/register";
    }
    
    return false;
  }, [settings.maintenance_mode]);

  // Refresh settings manually
  const refreshSettings = useCallback(() => {
    return fetchMaintenanceStatus();
  }, [fetchMaintenanceStatus]);

  ///////////////////////////////////////////////////////////////////////
  // =================== CONTEXT VALUE =============================== //
  ///////////////////////////////////////////////////////////////////////

  const contextValue = {
    settings,
    loading,
    error,
    maintenanceMode: settings.maintenance_mode,
    maintenanceMessage: settings.maintenance_message,
    isMaintenanceActive: settings.isMaintenanceActive || false,
    isSiteWide: settings.isSiteWide || false,
    isShopOnly: settings.isShopOnly || false,
    isRegistrationOnly: settings.isRegistrationOnly || false,
    isFeatureDisabled,
    shouldShowMaintenance,
    refreshSettings,
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== JSX BELOW =================================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

///////////////////////////////////////////////////////////////////////
// =================== PROP TYPES =================================== //
///////////////////////////////////////////////////////////////////////

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

///////////////////////////////////////////////////////////////////////
// =================== CUSTOM HOOK ================================== //
///////////////////////////////////////////////////////////////////////

/**
 * Custom hook to access settings context
 * @returns {Object} Settings context value
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default SettingsProvider;
