///////////////////////////////////////////////////////////////////////
// ================ EDIT FREIGHT COST MODAL ======================== //
///////////////////////////////////////////////////////////////////////

// Modal for editing freight costs and thresholds

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./EditFreightCostModal.module.css";

//  ========== Component imports  ========== //
import { CloseBtn, SaveBtn, CancelBtn, ToggleButton } from "../../../btn";

//  ========== Helper imports  ========== //
import {
  calculateFreightDefaults,
  applyFreightDefaults,
  FREIGHT_MULTIPLIERS,
  DEFAULT_THRESHOLDS,
} from "../../../helpers/calculateFreightDefaults";

//  ========== Validator imports  ========== //
import { validateFreightConfig, isValidLocal } from "../../../validators/freightValidator";

///////////////////////////////////////////////////////////////////////
// ================ CONSTANTS ====================================== //
///////////////////////////////////////////////////////////////////////

const ZONE_FIELDS = [
  { key: "local", label: "Local Delivery", required: true },
  { key: "north_island", label: "NZ North Island", multiplier: FREIGHT_MULTIPLIERS.north_island },
  { key: "south_island", label: "NZ South Island", multiplier: FREIGHT_MULTIPLIERS.south_island },
  { key: "intl_asia", label: "International - Asia", multiplier: FREIGHT_MULTIPLIERS.intl_asia },
  { key: "intl_north_america", label: "International - North America", multiplier: FREIGHT_MULTIPLIERS.intl_north_america },
  { key: "intl_europe", label: "International - Europe", multiplier: FREIGHT_MULTIPLIERS.intl_europe },
  { key: "intl_africa", label: "International - Africa", multiplier: FREIGHT_MULTIPLIERS.intl_africa },
  { key: "intl_latin_america", label: "International - Latin America", multiplier: FREIGHT_MULTIPLIERS.intl_latin_america },
];

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function EditFreightCostModal({
  isOpen,
  onClose,
  onSave,
  config,
  isSaving,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ================ STATE ========================================== //
  ///////////////////////////////////////////////////////////////////////

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDefaults, setShowDefaults] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ================ EFFECTS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isOpen && config) {
      setFormData({
        local: config.local || "",
        north_island: config.north_island || "",
        south_island: config.south_island || "",
        intl_asia: config.intl_asia || "",
        intl_north_america: config.intl_north_america || "",
        intl_europe: config.intl_europe || "",
        intl_africa: config.intl_africa || "",
        intl_latin_america: config.intl_latin_america || "",
        is_free_freight_enabled: config.is_free_freight_enabled || false,
        threshold_local: config.threshold_local || "",
        threshold_national: config.threshold_national || "",
        threshold_international: config.threshold_international || "",
      });
      setErrors({});
      setShowDefaults(false);
    }
  }, [isOpen, config]);

  ///////////////////////////////////////////////////////////////////////
  // ================ HANDLERS ======================================= //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Show defaults preview when local changes
    if (name === "local" && isValidLocal(value)) {
      setShowDefaults(true);
    }
  };

  const handleToggleFreeFreight = (enabled) => {
    setFormData((prev) => ({ ...prev, is_free_freight_enabled: enabled }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const validation = validateFreightConfig(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Apply defaults and save
    try {
      const processedData = applyFreightDefaults(formData);
      onSave(processedData);
    } catch (error) {
      setErrors({ local: error.message });
    }
  };

  const getCalculatedDefault = (key) => {
    if (!isValidLocal(formData.local)) return "";
    const defaults = calculateFreightDefaults(formData.local);
    return defaults ? defaults[key] : "";
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ RENDER ========================================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Edit Freight Costs</h2>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Zone Costs Section */}
          <div className={styles.section}>
            <h3>Zone Costs</h3>
            <p className={styles.sectionHint}>
              Leave fields empty to use calculated defaults based on Local rate
            </p>

            <div className={styles.fieldsGrid}>
              {ZONE_FIELDS.map((field) => (
                <div key={field.key} className={styles.fieldGroup}>
                  <label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className={styles.required}>*</span>}
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencyPrefix}>$</span>
                    <input
                      type="number"
                      id={field.key}
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder={
                        field.multiplier && showDefaults
                          ? `Default: ${getCalculatedDefault(field.key)}`
                          : field.required
                          ? "Required"
                          : "Auto-calculate"
                      }
                      className={errors[field.key] ? styles.inputError : ""}
                    />
                  </div>
                  {errors[field.key] && (
                    <span className={styles.errorText}>{errors[field.key]}</span>
                  )}
                  {field.multiplier && (
                    <span className={styles.hint}>
                      Default: Local × {field.multiplier}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Free Freight Section */}
          <div className={styles.section}>
            <h3>Free Freight</h3>
            <div className={styles.freeFreightToggle}>
              <span>Enable free freight for orders above threshold</span>
              <ToggleButton
                value={formData.is_free_freight_enabled}
                onChange={handleToggleFreeFreight}
              />
            </div>

            {formData.is_free_freight_enabled && (
              <div className={styles.thresholdsGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="threshold_local">Local Threshold</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencyPrefix}>$</span>
                    <input
                      type="number"
                      id="threshold_local"
                      name="threshold_local"
                      value={formData.threshold_local}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder={`Default: ${DEFAULT_THRESHOLDS.local}`}
                      className={errors.threshold_local ? styles.inputError : ""}
                    />
                  </div>
                  {errors.threshold_local && (
                    <span className={styles.errorText}>{errors.threshold_local}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="threshold_national">National Threshold (NZ)</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencyPrefix}>$</span>
                    <input
                      type="number"
                      id="threshold_national"
                      name="threshold_national"
                      value={formData.threshold_national}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder={`Default: ${DEFAULT_THRESHOLDS.national}`}
                      className={errors.threshold_national ? styles.inputError : ""}
                    />
                  </div>
                  {errors.threshold_national && (
                    <span className={styles.errorText}>{errors.threshold_national}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="threshold_international">International Threshold</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencyPrefix}>$</span>
                    <input
                      type="number"
                      id="threshold_international"
                      name="threshold_international"
                      value={formData.threshold_international}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder={`Default: ${DEFAULT_THRESHOLDS.international}`}
                      className={errors.threshold_international ? styles.inputError : ""}
                    />
                  </div>
                  {errors.threshold_international && (
                    <span className={styles.errorText}>{errors.threshold_international}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <CancelBtn onClick={onClose} disabled={isSaving}>
              Cancel
            </CancelBtn>
            <SaveBtn type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </SaveBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
