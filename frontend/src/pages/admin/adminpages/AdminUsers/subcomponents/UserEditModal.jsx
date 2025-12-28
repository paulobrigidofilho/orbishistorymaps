///////////////////////////////////////////////////////////////////////
// ===================== USER EDIT MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for editing user profile information

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./UserEditModal.module.css";

//  ========== Function imports  ========== //
import getChangedUserFields from "../../../functions/getChangedUserFields";
import uploadUserAvatar from "../../../functions/uploadUserAvatar";

//  ========== Validator imports  ========== //
import validateUserEditForm from "../../../validators/validateUserEditForm";
import validateAvatarFile from "../../../validators/validateAvatarFile";

//  ========== Constants imports  ========== //
import { SUCCESS_MESSAGES, DEFAULT_AVATAR } from "../../../constants/adminSuccessMessages";
import { ERROR_MESSAGES } from "../../../constants/adminErrorMessages";

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
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });
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
        address: user.address || "",
        addressLine2: user.addressLine2 || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        password: "", // Never pre-fill password
        confirmPassword: "", // Never pre-fill confirm password
      });
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
    const newErrors = validateUserEditForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getChangedFields = () => {
    return getChangedUserFields(formData, user);
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
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      password: "",
      confirmPassword: "",
    });
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
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit User Profile</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
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

          {/* Address Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Address Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address Line 1</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
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
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
