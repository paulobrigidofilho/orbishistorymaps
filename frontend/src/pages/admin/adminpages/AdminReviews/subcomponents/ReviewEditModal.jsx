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
    review_text: "",
    review_title: "",
    is_approved: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating || 5,
        review_text: review.review_text || "",
        review_title: review.review_title || "",
        is_approved: review.is_approved || false,
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
    if (!formData.review_text || formData.review_text.trim().length < 3) {
      newErrors.review_text = "Review text must be at least 3 characters.";
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
      await onSave(review.review_id, formData);
      setSuccessMessage(SUCCESS_MESSAGES.USER_UPDATED || "Review updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrors({ submit: error.message || ERROR_MESSAGES.UPDATE_USER_ERROR || "Failed to update review" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ rating: 5, review_text: "", review_title: "", is_approved: false });
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
            <label htmlFor="review_title">Title</label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              value={formData.review_title}
              onChange={handleInputChange}
              placeholder="Review title (optional)"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="review_text">Review Text</label>
            <textarea
              id="review_text"
              name="review_text"
              value={formData.review_text}
              onChange={handleInputChange}
              className={errors.review_text ? styles.inputError : ""}
              rows={4}
            />
            {errors.review_text && <span className={styles.errorText}>{errors.review_text}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="is_approved">Status</label>
            <select
              id="is_approved"
              name="is_approved"
              value={formData.is_approved ? "true" : "false"}
              onChange={(e) => setFormData(prev => ({ ...prev, is_approved: e.target.value === "true" }))}
            >
              <option value="false">Pending</option>
              <option value="true">Approved</option>
            </select>
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
