///////////////////////////////////////////////////////////////////////
// =================== DELETE USER MODAL COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This component displays a confirmation dialog before deleting a user

//  ========== Module imports  ========== //
import React from "react";
import styles from "./DeleteUserModal.module.css";

//  ========== Button imports  ========== //
import { CancelBtn, ConfirmBtn, CloseBtn } from "../../../btn";

///////////////////////////////////////////////////////////////////////
// ===================== DELETE USER MODAL ========================== //
///////////////////////////////////////////////////////////////////////

export default function DeleteUserModal({ user, isOpen, onClose, onConfirm, isDeleting }) {
  ///////////////////////////////////////////////////////////////////////
  // ======================= EARLY RETURN ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen || !user) return null;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>Delete User</h2>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.warningText}>
            Do you really want to delete this user?
          </p>
          <p className={styles.userInfo}>
            <strong>{user.firstName} {user.lastName}</strong>
            <br />
            <span>{user.email}</span>
          </p>
          <p className={styles.warningDetails}>
            All related information will be deleted as well, including:
          </p>
          <ul className={styles.deletionList}>
            <li>User profile and avatar</li>
            <li>Cart and saved items</li>
            <li>Order history</li>
            <li>All associated data</li>
          </ul>
          <p className={styles.irreversibleWarning}>
            This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <CancelBtn onClick={onClose} disabled={isDeleting} />
          <ConfirmBtn
            onClick={() => onConfirm(user.id)}
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete User
          </ConfirmBtn>
        </div>
      </div>
    </div>
  );
}
