///////////////////////////////////////
// ===== PROFILE DIV COMPONENT ===== //
///////////////////////////////////////

// This component handles the profile information input fields including
// avatar upload/preview functionality and nickname input.

//  ========== Component imports  ========== //

import styles from "../Auth.module.css";

// ========== ProfileDiv Component ========== //

function ProfileDiv({
  nickname,
  setNickname,
  avatarPreview,
  storedAvatarPath,
  avatarError,
  handleAvatarChange,
  handleDeleteAvatar,
  handleCancelAvatarSelection,
  handleUploadAvatar,
  avatarUploadSuccess,
  avatarUploading,
  pendingUpload,
  readOnly = false,
}) {
  const isRegistrationMode = !handleUploadAvatar && !handleCancelAvatarSelection;

  const DEFAULT_AVATAR = "/assets/common/default-avatar.png";
  const hasStoredAvatar = storedAvatarPath && storedAvatarPath.trim() !== '';
  const currentAvatarSrc = hasStoredAvatar ? storedAvatarPath : DEFAULT_AVATAR;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Profile</h2>

      {/* Only show avatar upload controls if not in readOnly mode */}
      {!readOnly && (
        <>
          <div className={styles.uploadAvatarSection}>
            <label htmlFor="avatar-upload" className={styles.avatarLabel}>
              Avatar:
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.inputField}
              disabled={avatarUploading}
            />
            {/* Show upload/cancel buttons for Profile page when file is selected */}
            {!isRegistrationMode && pendingUpload && !avatarUploading && (
              <>
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  className={styles.uploadButton}
                  title="Upload Avatar"
                >
                  📤
                </button>
                <button
                  type="button"
                  onClick={handleCancelAvatarSelection}
                  className={styles.cancelFileButton}
                  title="Cancel Selection"
                >
                  X
                </button>
              </>
            )}
            {/* Show cancel X for Register page when file is selected */}
            {isRegistrationMode && pendingUpload && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className={styles.cancelFileButton}
                title="Cancel Selection"
              >
                X
              </button>
            )}
          </div>

          {/* Avatar error messages */}
          {avatarError && (
            <div className={styles.avatarErrorMessage}>{avatarError}</div>
          )}
        </>
      )}

      {/* Preview section - show when pending upload */}
      {pendingUpload && avatarPreview && !avatarUploading && (
        <div className={styles.avatarPreviewContainer}>
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className={styles.avatarPreview}
          />
          <div className={styles.previewLabel}>Preview</div>
        </div>
      )}

      {/* Loading state during upload (Profile page only) */}
      {!isRegistrationMode && avatarUploading && (
        <div className={styles.avatarPreviewContainer}>
          <img
            src={avatarPreview || DEFAULT_AVATAR}
            alt="Avatar Preview"
            className={styles.avatarPreview}
          />
          <div className={styles.loadingLabel}>Loading...</div>
        </div>
      )}

      {/* Success message (Profile page only) */}
      {!isRegistrationMode && avatarUploadSuccess && !avatarUploading && (
        <div className={styles.successMessage}>
          Avatar uploaded successfully
        </div>
      )}

      {/* Current avatar (Profile page) */}
      {!isRegistrationMode && !pendingUpload && !avatarUploading && (
        <div className={styles.avatarPreviewContainer}>
          <img
            src={currentAvatarSrc}
            alt="Current Avatar"
            className={styles.avatarPreview}
          />
          {!readOnly && hasStoredAvatar && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
              className={styles.deleteStoredAvatarButton}
              title="Delete Avatar"
            >
              X
            </button>
          )}
          <div className={styles.currentAvatarText}>Current</div>
        </div>
      )}

      {/* Nickname Input */}
      <p className={styles.inputLabelNick}>Nickname:*</p>
      <input
        type="text"
        placeholder={!readOnly ? "Nickname (Required)" : ""}
        value={nickname}
        onChange={!readOnly ? (e) => setNickname(e.target.value) : undefined}
        readOnly={readOnly}
        className={`${styles.inputField} ${readOnly ? styles.readOnly : ""}`}
      />
    </div>
  );
}

export default ProfileDiv;
