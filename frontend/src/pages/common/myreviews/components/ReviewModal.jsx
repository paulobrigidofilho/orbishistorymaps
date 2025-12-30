///////////////////////////////////////////////////////////////////////
// ======================= REVIEW MODAL ============================= //
///////////////////////////////////////////////////////////////////////

// Modal for submitting/editing a review
// Used in ProductReviewsSection and MyReviews

import React, { useState } from "react";
import styles from "./ReviewModal.module.css";
import { REVIEW_MESSAGES } from "../constants/reviewConstants";
import createReview from "../functions/createReview";
import updateReview from "../functions/updateReview";
import { validateReview } from "../validators/reviewValidator";
import { SubmitReviewBtn } from "../btn";

export default function ReviewModal({ open, onClose, productId, userId, review, onSuccess }) {
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (review) {
      await updateReview(review._id, rating, comment);
    } else {
      await createReview(productId, rating, comment);
    }
    setLoading(false);
    onSuccess();
  };

  const errorMsg = validateReview(rating, comment);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h3>{review ? "Edit your review" : "Write a review"}</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.starsRow}>
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                className={star <= rating ? styles.starSelected : styles.star}
                onClick={() => setRating(star)}
              >★</span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className={styles.commentBox}
            required
          />
          <SubmitReviewBtn onClick={handleSubmit} disabled={loading || rating === 0 || !!errorMsg}>
            {loading ? "Saving..." : review ? "Update Review" : "Submit Review"}
          </SubmitReviewBtn>
          {errorMsg && <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>}
        </form>
      </div>
    </div>
  );
}
