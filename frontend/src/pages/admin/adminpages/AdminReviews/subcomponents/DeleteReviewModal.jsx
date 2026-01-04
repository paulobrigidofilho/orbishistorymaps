///////////////////////////////////////////////////////////////////////
// =================== DELETE REVIEW MODAL COMPONENT =============== //
///////////////////////////////////////////////////////////////////////

// This component displays a confirmation dialog before deleting a review

import React from "react";
import styles from "./DeleteReviewModal.module.css";
import { CancelBtn, ConfirmBtn, CloseBtn } from "../../../btn";

export default function DeleteReviewModal({ review, isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !review) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>Delete Review</h2>
          <CloseBtn onClick={onClose} />
        </div>
        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className={styles.warningIcon}>⚠️</div>
          <p className={styles.warningText}>
            Do you really want to delete this review?
          </p>
          <p className={styles.reviewInfo}>
            <strong>User:</strong> {review.user_nickname || review.userId?.name || review.userId}
            <br />
            <strong>Product:</strong> {review.product_name || review.productId?.name || review.productId}
            <br />
            <strong>Rating:</strong> {review.rating} star{review.rating > 1 ? "s" : ""}
            <br />
            <strong>Comment:</strong> {review.review_text || review.comment}
          </p>
          <p className={styles.irreversibleWarning}>
            This action cannot be undone.
          </p>
        </div>
        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <CancelBtn onClick={onClose} disabled={isDeleting} />
          <ConfirmBtn
            onClick={() => onConfirm(review.review_id || review._id)}
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete Review
          </ConfirmBtn>
        </div>
      </div>
    </div>
  );
}
