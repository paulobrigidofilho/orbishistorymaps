///////////////////////////////////////////////////////////////////////
// ================ FREIGHT COST MANAGEMENT COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

// This component displays and manages freight costs for all shipping zones
// Includes free freight threshold management and local zone configuration

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./FreightCostManagement.module.css";

//  ========== Component imports  ========== //
import EditFreightCostModal from "./EditFreightCostModal";
import LocalZoneManagement from "./LocalZoneManagement";
import FadeNotification from "../../../../common/components/FadeNotification";
import { ToggleButton } from "../../../btn";

//  ========== Function imports  ========== //
import getFreightConfig from "../../../functions/getFreightConfig";
import updateFreightConfig from "../../../functions/updateFreightConfig";

//  ========== Helper imports  ========== //
import { formatFreightCost } from "../../../helpers/calculateFreightDefaults";

///////////////////////////////////////////////////////////////////////
// ================ CONSTANTS ====================================== //
///////////////////////////////////////////////////////////////////////

// Function to generate zone labels with dynamic local zone name
const getZoneLabels = (localZoneCity = "Tauranga") => ({
  local: `Local Delivery (${localZoneCity})`,
  north_island: "NZ North Island",
  south_island: "NZ South Island",
  intl_asia: "International - Asia",
  intl_north_america: "International - North America",
  intl_europe: "International - Europe",
  intl_africa: "International - Africa",
  intl_latin_america: "International - Latin America",
});

const ZONE_ICONS = {
  local: "local_shipping",
  north_island: "flight_land",
  south_island: "flight_land",
  intl_asia: "flight",
  intl_north_america: "flight",
  intl_europe: "flight",
  intl_africa: "flight",
  intl_latin_america: "flight",
};

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function FreightCostManagement({ showNotification: parentShowNotification }) {
  ///////////////////////////////////////////////////////////////////////
  // ================ STATE ========================================== //
  ///////////////////////////////////////////////////////////////////////

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [localZoneCity, setLocalZoneCity] = useState("Tauranga");

  // Generate zone labels based on current local zone city
  const ZONE_LABELS = getZoneLabels(localZoneCity);

  ///////////////////////////////////////////////////////////////////////
  // ================ EFFECTS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchFreightConfig();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ================ FUNCTIONS ====================================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchFreightConfig = async () => {
    try {
      setLoading(true);
      const data = await getFreightConfig();
      setConfig(data);
      // Update local zone city from config if available
      if (data.local_zone_city) {
        setLocalZoneCity(data.local_zone_city);
      }
    } catch (error) {
      console.error("Error fetching freight config:", error);
      showNotificationMessage("error", "Failed to load freight configuration");
    } finally {
      setLoading(false);
    }
  };

  // Handler for when local zone changes
  const handleLocalZoneChange = (newLocalZone) => {
    setLocalZoneCity(newLocalZone.city);
  };

  const showNotificationMessage = (type, text) => {
    // Use parent notification if provided, otherwise use local
    if (parentShowNotification) {
      parentShowNotification(type, text);
    } else {
      setNotification({ key: Date.now(), type, text });
    }
  };

  const handleSaveConfig = async (newConfig) => {
    try {
      setSaving(true);
      const updated = await updateFreightConfig(newConfig);
      setConfig(updated);
      setShowEditModal(false);
      showNotificationMessage("success", "Freight configuration updated successfully");
    } catch (error) {
      console.error("Error saving freight config:", error);
      showNotificationMessage("error", error.message || "Failed to update freight configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleFreeFreightToggle = async (enabled) => {
    try {
      setSaving(true);
      const updated = await updateFreightConfig({
        ...config,
        is_free_freight_enabled: enabled,
      });
      setConfig(updated);
      showNotificationMessage(
        "success",
        enabled ? "Free freight enabled" : "Free freight disabled"
      );
    } catch (error) {
      console.error("Error toggling free freight:", error);
      showNotificationMessage("error", "Failed to toggle free freight");
    } finally {
      setSaving(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ RENDER ========================================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.freightManagement}>
        <div className={styles.loading}>Loading freight configuration...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.freightManagement}>
        <div className={styles.error}>Failed to load freight configuration</div>
      </div>
    );
  }

  return (
    <div className={styles.freightManagementWrapper}>
      {/* Local Zone Management Section */}
      <LocalZoneManagement 
        showNotification={parentShowNotification || showNotificationMessage}
        onLocalZoneChange={handleLocalZoneChange}
      />

      {/* Freight Costs Section */}
      <div className={styles.freightManagement}>
        {/* Notification - only show if parent doesn't handle it */}
        {!parentShowNotification && notification && (
          <FadeNotification
            key={notification.key}
            type={notification.type}
            text={notification.text}
            duration={4000}
            position="top"
            onComplete={() => setNotification(null)}
          />
        )}

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3>📦 Freight Costs</h3>
            <p className={styles.description}>
              Manage shipping rates for all delivery zones
            </p>
          </div>
          <button
            className={styles.editButton}
            onClick={() => setShowEditModal(true)}
            disabled={saving}
          >
            <i className="material-icons">edit</i>
            Edit Costs
          </button>
        </div>

        {/* Zone Costs Grid */}
        <div className={styles.zonesGrid}>
          {Object.entries(ZONE_LABELS).map(([key, label]) => (
            <div key={key} className={styles.zoneCard}>
              <div className={styles.zoneIcon}>
                <i className="material-icons">{ZONE_ICONS[key]}</i>
              </div>
              <div className={styles.zoneInfo}>
                <span className={styles.zoneLabel}>{label}</span>
                <span className={styles.zoneCost}>
                  {formatFreightCost(config[key])}
                </span>
              </div>
            </div>
          ))}
        </div>

      {/* Free Freight Section */}
      <div className={styles.freeFreightSection}>
        <div className={styles.freeFreightHeader}>
          <div className={styles.freeFreightInfo}>
            <h4>
              <i className="material-icons">local_offer</i>
              Free Freight
            </h4>
            <p>Enable free shipping when order total exceeds threshold</p>
          </div>
          <ToggleButton
            value={config.is_free_freight_enabled}
            onChange={handleFreeFreightToggle}
            disabled={saving}
            yesLabel="YES"
            noLabel="NO"
          />
        </div>

        {config.is_free_freight_enabled && (
          <div className={styles.thresholdsGrid}>
            <div className={styles.thresholdCard}>
              <span className={styles.thresholdLabel}>Local Threshold</span>
              <span className={styles.thresholdValue}>
                {formatFreightCost(config.threshold_local)}
              </span>
            </div>
            <div className={styles.thresholdCard}>
              <span className={styles.thresholdLabel}>National Threshold</span>
              <span className={styles.thresholdValue}>
                {formatFreightCost(config.threshold_national)}
              </span>
            </div>
            <div className={styles.thresholdCard}>
              <span className={styles.thresholdLabel}>International Threshold</span>
              <span className={styles.thresholdValue}>
                {formatFreightCost(config.threshold_international)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditFreightCostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveConfig}
        config={config}
        isSaving={saving}
      />
      </div>
    </div>
  );
}
