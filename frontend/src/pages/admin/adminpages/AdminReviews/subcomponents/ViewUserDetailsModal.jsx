///////////////////////////////////////////////////////////////////////
// ================= VIEW USER DETAILS MODAL COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

// Hover-triggered modal showing user details
// Displays first name, last name, email with View Full Profile button
// Uses absolute positioning relative to trigger element

//  ========== Module imports  ========== //
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewUserDetailsModal.module.css";

///////////////////////////////////////////////////////////////////////
// ================= VIEW USER DETAILS MODAL COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

export default function ViewUserDetailsModal({
  user,
  isVisible,
  position,
  onMouseEnter,
  onMouseLeave,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HOOKS ================================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////////////////
  // ========================= RENDER GUARD ========================== //
  ///////////////////////////////////////////////////////////////////////

  if (!isVisible || !user) return null;

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleViewFullProfile = () => {
    // Navigate to AdminUsers with user email as search parameter
    const email = user.user_email || user.email || "";
    navigate(`/admin/users?search=${encodeURIComponent(email)}`);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div
      className={styles.modal}
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* User Avatar */}
      <div className={styles.avatarSection}>
        {user.user_avatar ? (
          <img
            src={user.user_avatar}
            alt={user.user_nickname || "User"}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {(user.user_firstname || user.firstName || "U")[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* User Details */}
      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.label}>First Name:</span>
          <span className={styles.value}>
            {user.user_firstname || user.firstName || "N/A"}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Last Name:</span>
          <span className={styles.value}>
            {user.user_lastname || user.lastName || "N/A"}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>
            {user.user_email || user.email || "N/A"}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Nickname:</span>
          <span className={styles.value}>
            {user.user_nickname || user.nickname || "N/A"}
          </span>
        </div>
      </div>

      {/* View Full Profile Button */}
      <button
        className={styles.viewProfileBtn}
        onClick={handleViewFullProfile}
      >
        View Full Profile →
      </button>
    </div>
  );
}
