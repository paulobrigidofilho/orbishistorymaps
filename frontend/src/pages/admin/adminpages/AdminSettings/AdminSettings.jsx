///////////////////////////////////////////////////////////////////////
// ====================== ADMIN SETTINGS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

// This page displays admin settings and configuration options

//  ========== Module imports  ========== //
import React, { useState } from "react";
import styles from "./AdminSettings.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";

///////////////////////////////////////////////////////////////////////
// ====================== ADMIN SETTINGS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminSettings() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [settings, setSettings] = useState({
    siteName: "Orbis History Maps",
    siteEmail: "admin@orbis.com",
    currency: "NZD",
    taxRate: "15",
    shippingFee: "10.00",
    enableRegistration: true,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // TODO: Implement settings save API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(ERROR_MESSAGES.SAVE_SETTINGS_ERROR);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.settingsPage}>
        <div className={styles.header}>
          <h1>Settings</h1>
        </div>

        {success && <div className={styles.success}>{SUCCESS_MESSAGES.SETTINGS_SAVED}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* General Settings */}
          <section className={styles.section}>
            <h2>General Settings</h2>

            <div className={styles.formGroup}>
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="siteEmail">Site Email</label>
              <input
                type="email"
                id="siteEmail"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </section>

          {/* Store Settings */}
          <section className={styles.section}>
            <h2>Store Settings</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="NZD">NZD - New Zealand Dollar</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="taxRate">Tax Rate (%)</label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="shippingFee">Default Shipping Fee</label>
                <input
                  type="number"
                  id="shippingFee"
                  name="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* System Settings */}
          <section className={styles.section}>
            <h2>System Settings</h2>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="enableRegistration"
                  checked={settings.enableRegistration}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Enable User Registration
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Maintenance Mode
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
