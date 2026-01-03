///////////////////////////////////////////////////////////////////////
// ================ LOCAL ZONE MANAGEMENT COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

// This component allows admins to change the local freight zone origin city
// Uses Google Places API for city search, restricted to NZ North Island

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./LocalZoneManagement.module.css";

//  ========== Component imports  ========== //
import FadeNotification from "../../../../common/components/FadeNotification";
import CitySearchInput from "./CitySearchInput";

//  ========== Function imports  ========== //
import getLocalZoneConfig from "../../../functions/getLocalZoneConfig";
import updateLocalZoneConfig from "../../../functions/updateLocalZoneConfig";

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function LocalZoneManagement({ showNotification: parentShowNotification, onLocalZoneChange }) {
  ///////////////////////////////////////////////////////////////////////
  // ================ STATE ========================================== //
  ///////////////////////////////////////////////////////////////////////

  const [localZone, setLocalZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [notification, setNotification] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ================ EFFECTS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchData();
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ================ FUNCTIONS ====================================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchData = async () => {
    try {
      setLoading(true);
      const zoneData = await getLocalZoneConfig();
      setLocalZone(zoneData);
    } catch (error) {
      console.error("Error fetching local zone data:", error);
      showNotificationMessage("error", "Failed to load local zone configuration");
    } finally {
      setLoading(false);
    }
  };

  const showNotificationMessage = (type, text) => {
    if (parentShowNotification) {
      parentShowNotification(type, text);
    } else {
      setNotification({ key: Date.now(), type, text });
    }
  };

  const handleOpenModal = () => {
    // Reset selected city when opening modal
    setSelectedCity(null);
    setShowModal(true);
  };

  // Handler for city selection from CitySearchInput
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSave = async () => {
    if (!selectedCity) {
      showNotificationMessage("error", "Please search and select a city");
      return;
    }

    try {
      setSaving(true);
      const result = await updateLocalZoneConfig({
        city: selectedCity.city,
        region: selectedCity.region,
        postalPrefixes: Array.isArray(selectedCity.postalPrefixes) 
          ? selectedCity.postalPrefixes.join(",") 
          : selectedCity.postalPrefixes,
        suburbs: "",
      });

      setLocalZone({
        ...localZone,
        city: result.city,
        region: result.region,
        postalPrefixes: result.postalPrefixes,
        suburbs: result.suburbs,
      });

      setShowModal(false);
      showNotificationMessage("success", `Local origin city changed to ${result.city}`);
      
      // Notify parent component
      if (onLocalZoneChange) {
        onLocalZoneChange(result);
      }
    } catch (error) {
      console.error("Error updating local zone:", error);
      showNotificationMessage("error", error.message || "Failed to update local origin city");
    } finally {
      setSaving(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ RENDER ========================================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.localZoneManagement}>
        <div className={styles.loading}>Loading local zone configuration...</div>
      </div>
    );
  }

  return (
    <div className={styles.localZoneManagement}>
      {/* Notification */}
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
          <h3>📍 Local Origin City</h3>
          <p className={styles.description}>
            Set which city is your local delivery origin
          </p>
        </div>
        <button
          className={styles.changeButton}
          onClick={handleOpenModal}
          disabled={saving}
        >
          <i className="material-icons">edit_location</i>
          Set Local Origin
        </button>
      </div>

      {/* Current Location Display */}
      <div className={styles.currentLocation}>
        <div className={styles.locationIcon}>
          <i className="material-icons">place</i>
        </div>
        <div className={styles.locationInfo}>
          <span className={styles.cityName}>{localZone?.city || "Tauranga"}</span>
          <span className={styles.regionName}>{localZone?.region || "Bay of Plenty"}</span>
        </div>
        <div className={styles.locationBadge}>
          <i className="material-icons">local_shipping</i>
          Local Origin
        </div>
      </div>

      {/* Info Note */}
      <div className={styles.infoNote}>
        <i className="material-icons">info</i>
        <span>
          Select any New Zealand city as your local origin. 
          Customers in this city will receive local freight rates.
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Set Local Origin City</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <i className="material-icons">close</i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDescription}>
                Search for a New Zealand city to set as your local delivery origin.
                Customers in this city will receive local freight rates.
              </p>

              {/* Google Places City Search */}
              <div className={styles.searchSection}>
                <label className={styles.searchLabel}>
                  <i className="material-icons">search</i>
                  Search City
                </label>
                <CitySearchInput
                  onCitySelect={handleCitySelect}
                  currentCity={localZone?.city || ""}
                  placeholder="Type a New Zealand city name..."
                  disabled={saving}
                />
              </div>

              {/* Selected City Preview */}
              {selectedCity && (
                <div className={styles.selectedCityPreview}>
                  <div className={styles.previewHeader}>
                    <i className="material-icons">check_circle</i>
                    <span>Selected City</span>
                  </div>
                  <div className={styles.previewContent}>
                    <div className={styles.previewCity}>
                      <span className={styles.previewCityName}>{selectedCity.city}</span>
                      <span className={styles.previewRegion}>{selectedCity.region}, New Zealand</span>
                    </div>
                    <div className={styles.previewPostal}>
                      <span className={styles.previewPostalLabel}>Postal Prefixes:</span>
                      <span className={styles.previewPostalValue}>
                        {Array.isArray(selectedCity.postalPrefixes) 
                          ? selectedCity.postalPrefixes.slice(0, 4).join(", ") 
                          : selectedCity.postalPrefixes}
                        {Array.isArray(selectedCity.postalPrefixes) && selectedCity.postalPrefixes.length > 4 ? "..." : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Current City Info */}
              {localZone?.city && (
                <div className={styles.currentCityInfo}>
                  <i className="material-icons">info_outline</i>
                  <span>Current local origin: <strong>{localZone.city}</strong></span>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={saving || !selectedCity}
              >
                {saving ? (
                  <>
                    <span className={styles.spinner}></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="material-icons">save</i>
                    Set Origin City
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
