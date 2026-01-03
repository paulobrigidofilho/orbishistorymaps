///////////////////////////////////////////////////////////////////////
// ================== PRODUCT ADD MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for creating new products
// Features: Image upload, auto-SKU generation, category selection, tags

//  ========== Module imports  ========== //
import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductEditModal.module.css";

//  ========== Component imports  ========== //
import TagInput from "./TagInput";
import { CloseBtn, CancelBtn, SaveBtn } from "../../../btn";

//  ========== Function imports  ========== //
import createProduct from "../../../functions/createProduct";
import uploadProductImage from "../../../functions/uploadProductImage";
import addMultipleTags from "../../../functions/addMultipleTags";
import getAllTags from "../../../functions/getAllTags";

//  ========== Helper imports  ========== //
import generateSKU from "../../../helpers/generateSKU";
import { addPendingTag, removePendingTag } from "../../../helpers/pendingTagHelpers";
import { removePendingImage, cleanupPendingImages } from "../../../helpers/pendingImageHelpers";

//  ========== Validator imports  ========== //
import validateProductForm from "../../../validators/validateProductForm";
import { validateProductImages } from "../../../validators/validateProductImages";

//  ========== Constants imports  ========== //
import { SUCCESS_MESSAGES } from "../../../constants/adminSuccessMessages";
import { ERROR_MESSAGES } from "../../../constants/adminErrorMessages";
import { PRODUCT_IMAGE_LIMIT } from "../../../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// =================== ADD PRODUCT MODAL COMPONENT ================== //
///////////////////////////////////////////////////////////////////////

export default function AddProductModal({ isOpen, onClose, onSave, categories = [] }) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    sku: "",
    quantity_available: "",
    category_id: "",
    brand: "",
    is_featured: false,
    is_active: true,
  });
  const [pendingImages, setPendingImages] = useState([]);
  const [pendingTags, setPendingTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Image-specific state
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch tag suggestions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTagSuggestions();
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch tag suggestions for autocomplete
  const fetchTagSuggestions = async () => {
    try {
      const response = await getAllTags();
      if (response.data) {
        setTagSuggestions(response.data);
      }
    } catch (err) {
      console.error("Error fetching tag suggestions:", err);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      sale_price: "",
      sku: "",
      quantity_available: "",
      category_id: "",
      brand: "",
      is_featured: false,
      is_active: true,
    });
    setPendingImages([]);
    setPendingTags([]);
    setErrors({});
    setSuccessMessage("");
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = validateProductForm(formData, pendingImages.length);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== IMAGE FUNCTIONS ========================== //
  ///////////////////////////////////////////////////////////////////////

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageError("");

    // Validate images using the validator
    const validation = validateProductImages(
      files,
      pendingImages.length,
      PRODUCT_IMAGE_LIMIT
    );

    if (!validation.success) {
      setImageError(validation.error);
      e.target.value = "";
      return;
    }

    setPendingImages((prev) => [...prev, ...validation.validFiles]);
    e.target.value = ""; // Reset input for next selection
  };

  // Remove pending image
  const handleRemoveImage = (imageId) => {
    setPendingImages((prev) => removePendingImage(prev, imageId));
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== TAG FUNCTIONS ============================ //
  ///////////////////////////////////////////////////////////////////////

  // Add a pending tag (will be saved after product creation)
  const handleAddTag = (tagName) => {
    setPendingTags((prev) => addPendingTag(prev, tagName));
  };

  // Remove a pending tag
  const handleRemoveTag = (tagId) => {
    setPendingTags((prev) => removePendingTag(prev, tagId));
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== SUBMIT FUNCTION ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Prepare product data with auto-generated SKU if empty
      const productPayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        sku: formData.sku.trim() || generateSKU(formData.name),
        quantity_available: parseInt(formData.quantity_available),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        brand: formData.brand.trim() || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      // Create the product
      const response = await createProduct(productPayload);
      const newProductId = response.data?.product_id;

      // Upload images if any
      if (pendingImages.length > 0 && newProductId) {
        for (let i = 0; i < pendingImages.length; i++) {
          const isPrimary = i === 0; // First image is primary
          try {
            await uploadProductImage(newProductId, pendingImages[i].file, isPrimary);
          } catch (imgError) {
            console.error(`Failed to upload image ${i + 1}:`, imgError);
            // Continue with other images even if one fails
          }
        }
      }

      // Add tags if any
      if (pendingTags.length > 0 && newProductId) {
        const tagNames = pendingTags.map((tag) => tag.tag_name);
        try {
          await addMultipleTags(newProductId, tagNames);
        } catch (tagError) {
          console.error("Failed to add tags:", tagError);
          // Continue anyway - tags can be added later
        }
      }

      setSuccessMessage(SUCCESS_MESSAGES.PRODUCT_CREATED);
      
      // Notify parent and close after delay
      if (onSave) {
        onSave(response.data);
      }
      
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      setErrors({ submit: error.message || ERROR_MESSAGES.CREATE_PRODUCT_ERROR });
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ======================= CLOSE FUNCTION ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleClose = () => {
    // Clean up preview URLs using helper
    cleanupPendingImages(pendingImages);
    resetForm();
    onClose();
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add New Product</h2>
          <CloseBtn onClick={handleClose} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className={styles.errorMessage}>{errors.submit}</div>
          )}

          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="add-name">
                Product Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="add-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="add-description">Description</label>
              <textarea
                id="add-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter product description"
                className={errors.description ? styles.inputError : ""}
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="add-sku">
                  SKU
                  <span className={styles.skuHint}> (auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  id="add-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., PROD-001"
                  className={errors.sku ? styles.inputError : ""}
                />
                {errors.sku && (
                  <span className={styles.errorText}>{errors.sku}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-brand">Brand</label>
                <input
                  type="text"
                  id="add-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-category_id">Category</label>
                <select
                  id="add-category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={errors.category_id ? styles.inputError : ""}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={String(category.category_id)}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <span className={styles.errorText}>{errors.category_id}</span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Pricing & Inventory</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="add-price">
                  Price (NZD $) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="add-price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={errors.price ? styles.inputError : ""}
                />
                {errors.price && (
                  <span className={styles.errorText}>{errors.price}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-sale_price">Sale Price (NZD $)</label>
                <input
                  type="number"
                  id="add-sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {errors.sale_price && (
                  <span className={styles.errorText}>{errors.sale_price}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="add-quantity_available">
                  Stock Quantity <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="add-quantity_available"
                  name="quantity_available"
                  value={formData.quantity_available}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  className={errors.quantity_available ? styles.inputError : ""}
                />
                {errors.quantity_available && (
                  <span className={styles.errorText}>{errors.quantity_available}</span>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Settings</h3>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                Featured Product
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                Active (visible to customers)
              </label>
            </div>
          </div>

          {/* Tags Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Product Tags</h3>
            <TagInput
              tags={pendingTags}
              suggestions={tagSuggestions}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              placeholder="Add tags for search (e.g., wireless, bluetooth)..."
              maxTags={20}
            />
          </div>

          {/* Image Upload Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              Product Images
              <span className={styles.imageCount}>
                ({pendingImages.length}/{PRODUCT_IMAGE_LIMIT})
              </span>
            </h3>

            {/* Pending Images Preview */}
            {pendingImages.length > 0 && (
              <div className={styles.imageGrid}>
                {pendingImages.map((image, index) => (
                  <div key={image.id} className={styles.imageCard}>
                    <img src={image.preview} alt={`Preview ${index + 1}`} />
                    {index === 0 && (
                      <span className={styles.primaryBadge}>Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className={styles.deleteImageButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Controls */}
            <div className={styles.imageUploadSection}>
              {pendingImages.length >= PRODUCT_IMAGE_LIMIT ? (
                <p className={styles.imageLimitReached}>
                  Maximum {PRODUCT_IMAGE_LIMIT} images reached. Remove an image to add a new one.
                </p>
              ) : (
                <div className={styles.uploadControls}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    multiple
                    className={styles.fileInput}
                  />
                  <p className={styles.uploadHint}>
                    The first image will be the primary image. Max 10MB per image.
                  </p>
                </div>
              )}

              {imageError && (
                <span className={styles.errorText}>{imageError}</span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.modalFooter}>
            <CancelBtn onClick={handleClose} />
            <SaveBtn loading={loading} loadingText="Creating...">
              Create Product
            </SaveBtn>
          </div>
        </form>
      </div>
    </div>
  );
}
