///////////////////////////////////////////////////////////////////////
// ================= DELETE POST MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component displays a confirmation dialog before deleting a post

//  ========== Module imports  ========== //
import React from "react";
import styles from "./DeletePostModal.module.css";

//  ========== Button imports  ========== //
import { CancelBtn, ConfirmBtn, CloseBtn } from "../../../btn";

//  ========== Constants imports  ========== //
import { POST_LABELS } from "../constants/postConstants";

///////////////////////////////////////////////////////////////////////
// =================== DELETE POST MODAL ============================= //
///////////////////////////////////////////////////////////////////////

export default function DeletePostModal({ post, isOpen, onClose, onConfirm, isDeleting }) {
  ///////////////////////////////////////////////////////////////////////
  // ======================= EARLY RETURN ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen || !post) return null;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>Delete Post</h2>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.warningText}>
            {POST_LABELS.MESSAGES.CONFIRM_DELETE}
          </p>
          <div className={styles.postInfo}>
            <strong>{post.post_title}</strong>
            <br />
            <span className={styles.postStatus}>
              Status: {post.post_status === "published" ? "Published" : "Draft"}
            </span>
            <br />
            <span className={styles.postViews}>
              Views: {post.post_view_count || 0}
            </span>
          </div>
          <p className={styles.warningDetails}>
            This will permanently remove:
          </p>
          <ul className={styles.deletionList}>
            <li>The post content and metadata</li>
            <li>Associated images</li>
            <li>View count history</li>
          </ul>
          <p className={styles.irreversibleWarning}>
            This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <CancelBtn onClick={onClose} disabled={isDeleting} />
          <ConfirmBtn
            onClick={() => onConfirm(post.post_id)}
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Post
          </ConfirmBtn>
        </div>
      </div>
    </div>
  );
}
