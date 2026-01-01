///////////////////////////////////////////////////////////////////////
// ======================= REVIEW MODAL ============================= //
///////////////////////////////////////////////////////////////////////

// Modal for submitting/editing a review
// Used in ProductReviewsSection and MyReviews

import React, { useState, useEffect } from "react";
import styles from "./ReviewModal.module.css";
import { REVIEW_MESSAGES } from "../constants/reviewConstants";
import createReview from "../functions/createReview";
import updateReview from "../functions/updateReview";
import { validateReview } from "../validators/reviewValidator";
import { SubmitReviewBtn } from "../btn";

export default function ReviewModal({ open, onClose, productId, userId, review, onSuccess, onError }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens or review changes
  useEffect(() => {
    if (open) {
      setRating(review ? review.rating : 0);
      setComment(review ? (review.review_text || review.comment || "") : "");
      setTitle(review ? (review.review_title || "") : "");
      setError(null);
    }
  }, [open, review]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submission
    const validationError = validateReview(rating, comment);
    if (validationError) {
      setError(validationError);
      if (onError) {
        onError(validationError);
      }
      return;
    }
    
    setLoading(true);
    setError(null);
    const isUpdate = !!(review && review.review_id);
    try {
      if (isUpdate) {
        // updateReview(reviewId, rating, reviewText, reviewTitle)
        await updateReview(review.review_id, rating, comment, title);
      } else {
        // createReview(productId, rating, reviewText, reviewTitle)
        await createReview(productId, rating, comment, title);
      }
      onSuccess(isUpdate);
    } catch (err) {
      console.error("Error saving review:", err);
      const errorMsg = err.message || "Failed to save review";
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation for UI feedback (not for blocking)
  const currentValidationError = validateReview(rating, comment);

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
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            className={styles.titleInput}
          />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className={styles.commentBox}
          />
          <SubmitReviewBtn onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : review ? "Update Review" : "Submit Review"}
          </SubmitReviewBtn>
          {currentValidationError && <div style={{ color: '#888', marginTop: 8, fontSize: '0.9em' }}>{currentValidationError}</div>}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
