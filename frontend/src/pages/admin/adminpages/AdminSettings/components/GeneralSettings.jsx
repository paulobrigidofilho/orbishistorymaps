///////////////////////////////////////////////////////////////////////
// ================ GENERAL SETTINGS COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component handles general site settings like email configuration
// Styled to match the page design with card-based layout

//  ========== Module imports  ========== //
import React from "react";
import styles from "./GeneralSettings.module.css";

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function GeneralSettings({ settings, onInputChange }) {
  ///////////////////////////////////////////////////////////////////////
  // ================ RENDER ========================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.generalSettings}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3>⚙️ General Settings</h3>
          <p className={styles.description}>
            Configure your site's core settings
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className={styles.settingsForm}>
        {/* Site Email */}
        <div className={styles.fieldGroup}>
          <label htmlFor="site_email" className={styles.fieldLabel}>
            <i className="material-icons">email</i>
            Site Email
          </label>
          <p className={styles.fieldDescription}>
            Primary sender email for all automated notifications and communications.
          </p>
          <input
            type="email"
            id="site_email"
            name="site_email"
            value={settings.site_email || ""}
            onChange={onInputChange}
            className={styles.input}
            placeholder="admin@orbis.com"
          />
        </div>
      </div>
    </div>
  );
}
