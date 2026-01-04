///////////////////////////////////////////////////////////////////////
// ================== POST EDIT MODAL COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for creating/editing post information

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./PostEditModal.module.css";

//  ========== Component imports  ========== //
import { CloseBtn, CancelBtn, SaveBtn, UploadBtn } from "../../../btn";
import AdminAlertModal from "../../../components/AdminAlertModal/AdminAlertModal";

//  ========== Function imports  ========== //
import { createPost } from "../functions/createPost";
import { updatePost } from "../functions/updatePost";
import { uploadPostImage } from "../functions/uploadPostImage";

//  ========== Constants imports  ========== //
import { POST_LABELS } from "../constants/postConstants";
import { ADMIN_ERROR_ALERT_MESSAGES } from "../../../constants/adminAlertModalConstants";

///////////////////////////////////////////////////////////////////////
// =================== POST EDIT MODAL COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

export default function PostEditModal({ post, isOpen, isCreateMode, onClose, onSave }) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [formData, setFormData] = useState({
    post_title: "",
    post_content: "",
    post_excerpt: "",
    post_image_url: "",
    post_status: "draft",
    post_publish_date: "",
    seo_description: "",
    seo_keywords: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Image-specific state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Admin alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    config: {},
    onConfirm: null,
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isOpen) {
      if (post && !isCreateMode) {
        // Edit mode - populate form with existing data
        setFormData({
          post_title: post.post_title || "",
          post_content: post.post_content || "",
          post_excerpt: post.post_excerpt || "",
          post_image_url: post.post_image_url || "",
          post_status: post.post_status || "draft",
          post_publish_date: post.post_publish_date
            ? new Date(post.post_publish_date).toISOString().slice(0, 16)
            : "",
          seo_description: post.seo_description || "",
          seo_keywords: post.seo_keywords || "",
        });
        setImagePreview(post.post_image_url || null);
      } else {
        // Create mode - reset form
        setFormData({
          post_title: "",
          post_content: "",
          post_excerpt: "",
          post_image_url: "",
          post_status: "draft",
          post_publish_date: "",
          seo_description: "",
          seo_keywords: "",
        });
        setImagePreview(null);
      }
      // Reset states
      setImageFile(null);
      setImageError("");
      setErrors({});
      setSuccessMessage("");
    }
  }, [post, isOpen, isCreateMode]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.post_title.trim()) {
      newErrors.post_title = "Title is required";
    }

    if (!formData.post_content.trim()) {
      newErrors.post_content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPEG, PNG, GIF, and WebP images are allowed");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError("Image size must be less than 5MB");
        e.target.value = "";
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, post_image_url: "" }));
  };

  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, config: {}, onConfirm: null });
  };

  const showErrorAlert = (errorMessage) => {
    setAlertModal({
      isOpen: true,
      config: ADMIN_ERROR_ALERT_MESSAGES.GENERIC_ERROR(errorMessage),
      onConfirm: closeAlertModal,
    });
  };

  ///////////////////////////////////////////////////////////////////////
  // ======================= FORM SUBMISSION ========================= //
  ///////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      let imageUrl = formData.post_image_url;

      // Upload new image if selected
      if (imageFile) {
        setImageUploading(true);
        try {
          const uploadResult = await uploadPostImage(imageFile);
          imageUrl = uploadResult.imageUrl;
        } catch (err) {
          setImageError("Failed to upload image");
          setLoading(false);
          setImageUploading(false);
          return;
        }
        setImageUploading(false);
      }

      const postData = {
        ...formData,
        post_image_url: imageUrl,
        post_publish_date: formData.post_publish_date
          ? new Date(formData.post_publish_date).toISOString()
          : null,
      };

      if (isCreateMode) {
        // Create new post
        await createPost(postData);
        setSuccessMessage(POST_LABELS.MESSAGES.CREATE_SUCCESS);
      } else {
        // Update existing post
        await updatePost(post.post_id, postData);
        setSuccessMessage(POST_LABELS.MESSAGES.UPDATE_SUCCESS);
      }

      // Notify parent and close after brief delay
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (err) {
      showErrorAlert(err.message || POST_LABELS.MESSAGES.ERROR_SAVING);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <h2>{isCreateMode ? "Create New Post" : "Edit Post"}</h2>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {/* Modal Form */}
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Post Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="post_title">{POST_LABELS.FORM.TITLE} *</label>
              <input
                type="text"
                id="post_title"
                name="post_title"
                value={formData.post_title}
                onChange={handleInputChange}
                placeholder={POST_LABELS.FORM.TITLE_PLACEHOLDER}
                className={errors.post_title ? styles.inputError : ""}
              />
              {errors.post_title && (
                <span className={styles.errorText}>{errors.post_title}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="post_excerpt">{POST_LABELS.FORM.EXCERPT}</label>
              <input
                type="text"
                id="post_excerpt"
                name="post_excerpt"
                value={formData.post_excerpt}
                onChange={handleInputChange}
                placeholder={POST_LABELS.FORM.EXCERPT_PLACEHOLDER}
                maxLength={200}
              />
              <span className={styles.charCount}>
                {formData.post_excerpt.length}/200
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="post_content">
                {POST_LABELS.FORM.CONTENT} *
              </label>
              <textarea
                id="post_content"
                name="post_content"
                value={formData.post_content}
                onChange={handleInputChange}
                placeholder={POST_LABELS.FORM.CONTENT_PLACEHOLDER}
                rows={12}
                className={`${styles.contentTextarea} ${
                  errors.post_content ? styles.inputError : ""
                }`}
              />
              {errors.post_content && (
                <span className={styles.errorText}>{errors.post_content}</span>
              )}
              <span className={styles.helpText}>
                💡 Tip: You can use Markdown for formatting (headings, lists, links, etc.)
              </span>
            </div>
          </div>

          {/* Image Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>{POST_LABELS.FORM.IMAGE_URL}</h3>

            <div className={styles.imageUploadArea}>
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img
                    src={imagePreview}
                    alt="Post preview"
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={handleRemoveImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="imageUpload" className={styles.uploadLabel}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span>Click to upload header image</span>
                    <span className={styles.uploadHint}>JPEG, PNG, GIF, WebP (max 5MB)</span>
                  </label>
                </div>
              )}
              {imageError && (
                <span className={styles.errorText}>{imageError}</span>
              )}
              {imageUploading && (
                <span className={styles.uploadingText}>Uploading image...</span>
              )}
            </div>
          </div>

          {/* Publishing Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Publishing</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="post_status">{POST_LABELS.FORM.STATUS}</label>
                <select
                  id="post_status"
                  name="post_status"
                  value={formData.post_status}
                  onChange={handleInputChange}
                >
                  <option value="draft">{POST_LABELS.STATUS.DRAFT}</option>
                  <option value="published">{POST_LABELS.STATUS.PUBLISHED}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="post_publish_date">
                  {POST_LABELS.FORM.PUBLISH_DATE}
                </label>
                <input
                  type="datetime-local"
                  id="post_publish_date"
                  name="post_publish_date"
                  value={formData.post_publish_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>SEO Settings</h3>

            <div className={styles.formGroup}>
              <label htmlFor="seo_description">
                {POST_LABELS.FORM.SEO_DESCRIPTION}
              </label>
              <textarea
                id="seo_description"
                name="seo_description"
                value={formData.seo_description}
                onChange={handleInputChange}
                placeholder={POST_LABELS.FORM.SEO_DESCRIPTION_PLACEHOLDER}
                rows={3}
                maxLength={160}
              />
              <span className={styles.charCount}>
                {formData.seo_description.length}/160
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="seo_keywords">{POST_LABELS.FORM.SEO_KEYWORDS}</label>
              <input
                type="text"
                id="seo_keywords"
                name="seo_keywords"
                value={formData.seo_keywords}
                onChange={handleInputChange}
                placeholder={POST_LABELS.FORM.SEO_KEYWORDS_PLACEHOLDER}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <CancelBtn onClick={onClose} disabled={loading}>
              {POST_LABELS.BUTTONS.CANCEL}
            </CancelBtn>
            <SaveBtn type="submit" disabled={loading}>
              {loading ? "Saving..." : POST_LABELS.BUTTONS.SAVE}
            </SaveBtn>
          </div>
        </form>

        {/* Admin Alert Modal */}
        <AdminAlertModal
          isOpen={alertModal.isOpen}
          onClose={closeAlertModal}
          onConfirm={alertModal.onConfirm}
          type={alertModal.config.type}
          title={alertModal.config.title}
          message={alertModal.config.message}
          confirmText={alertModal.config.confirmText}
          cancelText={alertModal.config.cancelText}
          showCancel={alertModal.config.showCancel !== false}
          icon={alertModal.config.icon}
        />
      </div>
    </div>
  );
}
