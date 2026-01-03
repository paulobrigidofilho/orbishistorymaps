///////////////////////////////////////////////////////////////////////
// ===================== USER EDIT MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for editing user profile information

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./UserEditModal.module.css";

//  ========== Button imports  ========== //
import { CloseBtn, CancelBtn, SaveBtn } from "../../../btn";

//  ========== Component imports  ========== //
import FullAddressDiv from "../../../../common/auth/components/FullAddressDiv";

//  ========== Function imports  ========== //
import getChangedUserFields from "../../../helpers/getChangedUserFields";
import uploadUserAvatar from "../../../functions/uploadUserAvatar";

//  ========== Validator imports  ========== //
import validateUserEditForm from "../../../validators/validateUserEditForm";
import validateAvatarFile from "../../../validators/validateAvatarFile";

//  ========== Constants imports  ========== //
import { SUCCESS_MESSAGES, DEFAULT_AVATAR } from "../../../constants/adminSuccessMessages";
import { ERROR_MESSAGES } from "../../../constants/adminErrorMessages";

//  ========== Helper imports  ========== //
import capitalizeWords from "../../../../common/auth/helpers/capitalizeWords";

///////////////////////////////////////////////////////////////////////
// ==================== USER EDIT MODAL COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

export default function UserEditModal({ user, isOpen, onClose, onSave }) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });
  
  // Separate address state to work with FullAddressDiv
  const [address, setAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("New Zealand");
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Avatar-specific state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        avatar: user.avatar || "",
        password: "", // Never pre-fill password
        confirmPassword: "", // Never pre-fill confirm password
      });
      // Set address fields separately
      setAddress(user.address || "");
      setAddressLine2(user.addressLine2 || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipCode(user.zipCode || "");
      setCountry(user.country || "New Zealand");
      // Reset avatar states when user changes
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarError("");
      setAvatarSuccess("");
    }
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const fullFormData = {
      ...formData,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    };
    const newErrors = validateUserEditForm(fullFormData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getChangedFields = () => {
    const fullFormData = {
      ...formData,
      address,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    };
    return getChangedUserFields(fullFormData, user);
  };

  // Avatar handling functions
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarError("");
    setAvatarSuccess("");

    if (file) {
      const validation = validateAvatarFile(file);

      if (!validation.success) {
        setAvatarError(validation.error);
        e.target.value = "";
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user?.id) return;

    setAvatarUploading(true);
    setAvatarError("");
    setAvatarSuccess("");

    try {
      const response = await uploadUserAvatar(user.id, avatarFile);
      const newAvatarPath = response.avatar || response.avatarPath;
      
      // Update formData with new avatar path
      setFormData((prev) => ({
        ...prev,
        avatar: newAvatarPath,
      }));
      
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarSuccess(SUCCESS_MESSAGES.AVATAR_UPLOADED);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setAvatarSuccess("");
      }, 3000);
    } catch (error) {
      setAvatarError(error.message || "Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCancelAvatarSelection = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError("");
    // Reset file input
    const fileInput = document.getElementById("admin-avatar-upload");
    if (fileInput) fileInput.value = "";
  };

  // Get current avatar source for display
  const getCurrentAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (formData.avatar && formData.avatar.trim() !== "") return formData.avatar;
    return DEFAULT_AVATAR;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Only send changed fields
    const changes = getChangedFields();

    if (Object.keys(changes).length === 0) {
      setErrors({ submit: "No changes to save" });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await onSave(user.id, changes);
      setSuccessMessage(SUCCESS_MESSAGES.USER_UPDATED);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrors({ submit: error.message || ERROR_MESSAGES.UPDATE_USER_ERROR });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      nickname: "",
      avatar: "",
      password: "",
      confirmPassword: "",
    });
    // Reset address fields
    setAddress("");
    setAddressLine2("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("New Zealand");
    setErrors({});
    setSuccessMessage("");
    // Reset avatar states
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError("");
    setAvatarSuccess("");
    onClose();
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit User Profile</h2>
          <CloseBtn onClick={handleClose} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Personal Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">
                  First Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? styles.inputError : ""}
                />
                {errors.firstName && (
                  <span className={styles.errorText}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">
                  Last Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? styles.inputError : ""}
                />
                {errors.lastName && (
                  <span className={styles.errorText}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nickname">Nickname</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
              />
            </div>

            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <label className={styles.avatarLabel}>Avatar</label>
              
              {/* Current Avatar Display */}
              <div className={styles.avatarPreviewContainer}>
                <img
                  src={getCurrentAvatarSrc()}
                  alt="User Avatar"
                  className={styles.avatarPreview}
                />
                <span className={styles.avatarStatus}>
                  {avatarPreview ? "Preview" : formData.avatar ? "Current" : "Default"}
                </span>
              </div>

              {/* File Upload Controls */}
              <div className={styles.avatarUploadControls}>
                <input
                  type="file"
                  id="admin-avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.fileInput}
                  disabled={avatarUploading}
                />
                
                {/* Upload/Cancel buttons when file is selected */}
                {avatarFile && !avatarUploading && (
                  <div className={styles.avatarButtons}>
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      className={styles.uploadAvatarButton}
                      title="Upload Avatar"
                    >
                      📤 Upload
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAvatarSelection}
                      className={styles.cancelAvatarButton}
                      title="Cancel Selection"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}

                {/* Loading state */}
                {avatarUploading && (
                  <span className={styles.avatarLoading}>Uploading...</span>
                )}
              </div>

              {/* Avatar Error Message */}
              {avatarError && (
                <div className={styles.avatarErrorMessage}>{avatarError}</div>
              )}

              {/* Avatar Success Message */}
              {avatarSuccess && (
                <div className={styles.avatarSuccessMessage}>{avatarSuccess}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                New Password <span className={styles.optional}>(leave blank to keep current)</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                autoComplete="new-password"
                className={errors.password ? styles.inputError : ""}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className={errors.confirmPassword ? styles.inputError : ""}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Address Information - Using FullAddressDiv with Autocomplete */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Address Information</h3>
            <div className={styles.addressWrapper}>
              <FullAddressDiv
                address={address}
                setAddress={setAddress}
                addressLine2={addressLine2}
                setAddressLine2={setAddressLine2}
                city={city}
                setCity={setCity}
                stateName={state}
                setStateName={setState}
                zipCode={zipCode}
                setZipCode={setZipCode}
                country={country}
                setCountry={setCountry}
                capitalizeWords={capitalizeWords}
                readOnly={false}
              />
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          {/* Modal Actions */}
          <div className={styles.modalActions}>
            <CancelBtn onClick={handleClose} disabled={loading}>Close</CancelBtn>
            <SaveBtn loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
