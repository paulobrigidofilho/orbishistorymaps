///////////////////////////////////////////////////////////////////////
// ====================== ADMIN SETTINGS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

// This page displays admin settings and configuration options
// Includes maintenance mode management with confirmation modals

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminSettings.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";
import ConfirmMaintenanceModal from "./components/ConfirmMaintenanceModal";
import FreightCostManagement from "./components/FreightCostManagement";
import GeneralSettings from "./components/GeneralSettings";
import FadeNotification from "../../../common/components/FadeNotification";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";
import {
  MAINTENANCE_MODES,
  MAINTENANCE_MODE_OPTIONS,
  SETTINGS_MESSAGES,
  DEFAULT_SETTINGS,
} from "../../constants/adminSettingsConstants";

//  ========== Context imports  ========== //
import { useSettings } from "../../../common/context/SettingsContext";

//  ========== Function imports  ========== //
import getAllSettings from "../../functions/getAllSettings";
import updateSettings from "../../functions/updateSettings";
import setMaintenanceMode from "../../functions/setMaintenanceMode";

///////////////////////////////////////////////////////////////////////
// ====================== ADMIN SETTINGS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminSettings() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= CONTEXT & STATE ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Get refreshSettings from context to update maintenance mode globally
  const { refreshSettings: refreshGlobalSettings } = useSettings();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Maintenance modal state
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [pendingMaintenanceMode, setPendingMaintenanceMode] = useState(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ======================= FETCH SETTINGS ========================== //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getAllSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching settings:", error);
      showNotification("error", SETTINGS_MESSAGES.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const showNotification = (type, text) => {
    setNotification({ key: Date.now(), type, text });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Exclude maintenance mode from regular save (handled separately)
      const { maintenance_mode, ...settingsToSave } = settings;
      await updateSettings(settingsToSave);
      showNotification("success", SETTINGS_MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      console.error("Error saving settings:", error);
      showNotification("error", error.message || SETTINGS_MESSAGES.SAVE_ERROR);
    } finally {
      setSaving(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // =================== MAINTENANCE MODE HANDLERS =================== //
  ///////////////////////////////////////////////////////////////////////

  const handleMaintenanceModeClick = (mode) => {
    if (mode === settings.maintenance_mode) return;
    setPendingMaintenanceMode(mode);
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceConfirm = async (mode) => {
    setMaintenanceLoading(true);

    try {
      await setMaintenanceMode(mode, settings.maintenance_message);
      setSettings((prev) => ({ ...prev, maintenance_mode: mode }));
      setShowMaintenanceModal(false);
      setPendingMaintenanceMode(null);
      
      // Refresh global settings context so all components see the change immediately
      await refreshGlobalSettings();
      
      const message = mode === "off" 
        ? SETTINGS_MESSAGES.MAINTENANCE_DISABLED 
        : SETTINGS_MESSAGES.MAINTENANCE_ENABLED;
      showNotification("success", message);
    } catch (error) {
      console.error("Error setting maintenance mode:", error);
      showNotification("error", error.message || SETTINGS_MESSAGES.MAINTENANCE_CHANGE_ERROR);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleMaintenanceCancel = () => {
    setShowMaintenanceModal(false);
    setPendingMaintenanceMode(null);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.settingsPage}>
          <div className={styles.header}>
            <h1>Settings</h1>
          </div>
          <div className={styles.loading}>Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.settingsPage}>
        <div className={styles.header}>
          <h1>Settings</h1>
        </div>

        {/* Notification */}
        {notification && (
          <FadeNotification
            key={notification.key}
            type={notification.type}
            text={notification.text}
            duration={4000}
            position="top"
            onComplete={() => setNotification(null)}
          />
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* =================== MAINTENANCE MODE SECTION =================== */}
          <section className={styles.section}>
            <h2>🛠️ Maintenance Mode</h2>
            <p className={styles.sectionDescription}>
              Control site accessibility for users. Admin pages remain accessible in all modes.
            </p>

            <div className={styles.maintenanceOptions}>
              {MAINTENANCE_MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.maintenanceButton} ${
                    settings.maintenance_mode === option.value ? styles.active : ""
                  } ${styles[option.value.replace("-", "")]}`}
                  onClick={() => handleMaintenanceModeClick(option.value)}
                >
                  <span className={styles.maintenanceLabel}>{option.label}</span>
                  <span className={styles.maintenanceDesc}>{option.description}</span>
                  {settings.maintenance_mode === option.value && (
                    <i className="material-icons">check_circle</i>
                  )}
                </button>
              ))}
            </div>

            {settings.maintenance_mode !== "off" && (
              <div className={styles.maintenanceMessageGroup}>
                <label htmlFor="maintenance_message">Maintenance Message</label>
                <textarea
                  id="maintenance_message"
                  name="maintenance_message"
                  value={settings.maintenance_message}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Enter a custom maintenance message..."
                />
              </div>
            )}
          </section>

          {/* =================== GENERAL SETTINGS SECTION =================== */}
          <GeneralSettings 
            settings={settings} 
            onInputChange={handleInputChange} 
          />

          {/* =================== FEATURE TOGGLES SECTION =================== */}
          <section className={styles.section}>
            <h2>Feature Toggles</h2>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="enable_registration"
                  checked={settings.enable_registration}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Enable User Registration
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="enable_reviews"
                  checked={settings.enable_reviews}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Enable Product Reviews
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="enable_wishlist"
                  checked={settings.enable_wishlist}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Enable Wishlist Feature
              </label>
            </div>
          </section>

          {/* =================== SUBMIT BUTTON =================== */}
          <div className={styles.actions}>
            <button type="submit" disabled={saving} className={styles.submitButton}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* =================== FREIGHT COSTS SECTION (Outside form to prevent nested form issues) =================== */}
        <FreightCostManagement showNotification={showNotification} />

        {/* =================== MAINTENANCE CONFIRMATION MODAL =================== */}
        <ConfirmMaintenanceModal
          isOpen={showMaintenanceModal}
          targetMode={pendingMaintenanceMode}
          currentMode={settings.maintenance_mode}
          onConfirm={handleMaintenanceConfirm}
          onCancel={handleMaintenanceCancel}
          isLoading={maintenanceLoading}
        />
      </div>
    </AdminLayout>
  );
}
