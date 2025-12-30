///////////////////////////////////////////////////////////////////////
// ===================== REVIEW EDIT MODAL COMPONENT =============== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for editing a review (admin only)

import React, { useState, useEffect } from "react";
import styles from "./ReviewEditModal.module.css";
import { CancelBtn, SaveBtn, CloseBtn } from "../../../btn";
import { SUCCESS_MESSAGES } from "../../../constants/adminSuccessMessages";
import { ERROR_MESSAGES } from "../../../constants/adminErrorMessages";

export default function ReviewEditModal({ review, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    approved: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating || 5,
        comment: review.comment || "",
        approved: review.approved || false,
      });
      setErrors({});
      setSuccessMessage("");
    }
  }, [review]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5.";
    }
    if (!formData.comment || formData.comment.trim().length < 3) {
      newErrors.comment = "Comment must be at least 3 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    setSuccessMessage("");
    try {
      await onSave(review._id, formData);
      setSuccessMessage(SUCCESS_MESSAGES.USER_UPDATED || "Review updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ submit: error.message || ERROR_MESSAGES.UPDATE_USER_ERROR || "Failed to update review" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ rating: 5, comment: "", approved: false });
    setErrors({});
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Review</h2>
          <CloseBtn onClick={handleClose} />
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className={errors.rating ? styles.inputError : ""}
            >
              {[5,4,3,2,1].map(r => (
                <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
              ))}
            </select>
            {errors.rating && <span className={styles.errorText}>{errors.rating}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className={errors.comment ? styles.inputError : ""}
              rows={4}
            />
            {errors.comment && <span className={styles.errorText}>{errors.comment}</span>}
          </div>
          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                name="approved"
                checked={formData.approved}
                onChange={handleInputChange}
              />
              Approved
            </label>
          </div>
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
          {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
          <div className={styles.modalActions}>
            <CancelBtn onClick={handleClose} disabled={loading} />
            <SaveBtn loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
