///////////////////////////////////////
// ===== PROFILE DIV COMPONENT ===== //
///////////////////////////////////////

// This component handles the profile information input fields including
// avatar upload/preview functionality and nickname input.

//  ========== Component imports  ========== //

import React from "react";
import styles from "../Auth.module.css";

// ========== ProfileDiv Component ========== //

function ProfileDiv({
  nickname,
  setNickname,
  avatarPreview,
  avatarError,
  handleAvatarChange,
  handleDeleteAvatar
}) {
  ///////////////////////////////////////////////////////////////////////
  // ================================================================= //
  // ========================= JSX BELOW ============================= //
  // ================================================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputHeader}>Profile</h2>
      
      {/* Avatar upload inputs/preview */}
      <div className={styles.uploadAvatarSection}>
        <label htmlFor="avatar-upload" className={styles.avatarLabel}>Avatar:</label>
        <input 
          type="file" 
          id="avatar-upload" 
          accept="image/*" 
          onChange={handleAvatarChange} 
          className={styles.inputField} 
        />
        {avatarPreview && (
          <button 
            type="button" 
            onClick={handleDeleteAvatar} 
            className={styles.deleteButton}
          >
            X
          </button>
        )}
      </div>
      
      {avatarError && (
        <div className={styles.avatarErrorMessage}>{avatarError}</div>
      )}
      
      {avatarPreview && (
        <div className={styles.avatarPreviewContainer}>
          <img 
            src={avatarPreview} 
            alt="Avatar Preview" 
            className={styles.avatarPreview} 
          />
        </div>
      )}
      
      {/* Nickname Input */}
      <p className={styles.inputLabelNick}>Nickname:</p>
      <input 
        type="text" 
        placeholder="Nickname (Required)" 
        value={nickname} 
        onChange={(e) => setNickname(e.target.value)} 
        className={styles.inputField} 
      />
    </div>
  );
}

export default ProfileDiv;
