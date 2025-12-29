///////////////////////////////////////////////////////////////////////
// ================== PRODUCT EDIT MODAL COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component provides a modal for editing product information

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./ProductEditModal.module.css";

//  ========== Component imports  ========== //
import TagInput from "./TagInput";
import { CloseBtn, CancelBtn, SaveBtn, UploadBtn } from "../../../btn";

//  ========== Function imports  ========== //
import getProductById from "../../../functions/getProductById";
import uploadProductImage from "../../../functions/uploadProductImage";
import deleteProductImage from "../../../functions/deleteProductImage";
import getProductTags from "../../../functions/getProductTags";
import addProductTag from "../../../functions/addProductTag";
import deleteProductTag from "../../../functions/deleteProductTag";
import getAllTags from "../../../functions/getAllTags";
import getChangedProductFields from "../../../helpers/getChangedProductFields";

//  ========== Validator imports  ========== //
import validateProductForm from "../../../validators/validateProductForm";
import validateEditProductImage from "../../../validators/validateEditProductImage";

//  ========== Constants imports  ========== //
import { SUCCESS_MESSAGES } from "../../../constants/adminSuccessMessages";
import { ERROR_MESSAGES } from "../../../constants/adminErrorMessages";
import { PRODUCT_IMAGE_LIMIT } from "../../../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// =================== PRODUCT EDIT MODAL COMPONENT ================== //
///////////////////////////////////////////////////////////////////////

export default function ProductEditModal({ product, isOpen, onClose, onSave, categories = [] }) {
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
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Image-specific state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");

  // Tag-specific state
  const [tagError, setTagError] = useState("");

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.product_name || "",
        description: product.product_description || "",
        price: product.price || "",
        sale_price: product.sale_price || "",
        sku: product.sku || "",
        quantity_available: product.quantity_available || 0,
        category_id: product.category_id ? String(product.category_id) : "",
        brand: product.brand || "",
        is_featured: product.is_featured || false,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
      // Fetch full product details including images and tags
      fetchProductDetails();
      fetchProductTags();
      fetchTagSuggestions();
      // Reset states
      setImageFile(null);
      setImagePreview(null);
      setImageError("");
      setImageSuccess("");
      setTagError("");
      setErrors({});
      setSuccessMessage("");
    }
  }, [product, isOpen]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchProductDetails = async () => {
    if (!product?.product_id) return;
    try {
      const response = await getProductById(product.product_id);
      if (response.data?.images) {
        setImages(response.data.images);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  const fetchProductTags = async () => {
    if (!product?.product_id) return;
    try {
      const response = await getProductTags(product.product_id);
      if (response.data) {
        setTags(response.data);
      }
    } catch (err) {
      console.error("Error fetching product tags:", err);
    }
  };

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

  const validateForm = () => {
    const newErrors = validateProductForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");
    setImageSuccess("");

    if (file) {
      // Validate using the validator
      const validation = validateEditProductImage(file, images.length, PRODUCT_IMAGE_LIMIT);
      
      if (!validation.success) {
        setImageError(validation.error);
        e.target.value = "";
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !product?.product_id) return;

    setImageUploading(true);
    setImageError("");
    setImageSuccess("");

    try {
      await uploadProductImage(product.product_id, imageFile, images.length === 0);
      setImageFile(null);
      setImagePreview(null);
      await fetchProductDetails(); // Refresh images
      setImageSuccess("Image uploaded successfully!");
      setTimeout(() => setImageSuccess(""), 3000);
    } catch (error) {
      setImageError(error.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteProductImage(imageId);
      await fetchProductDetails(); // Refresh images
    } catch (err) {
      setImageError(err.message || "Failed to delete image");
    }
  };

  const handleCancelImageSelection = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    const fileInput = document.getElementById("product-image-upload");
    if (fileInput) fileInput.value = "";
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== TAG FUNCTIONS ============================ //
  ///////////////////////////////////////////////////////////////////////

  // Add a tag to the product (saves immediately)
  const handleAddTag = async (tagName) => {
    if (!product?.product_id) return;
    
    setTagError("");
    try {
      const response = await addProductTag(product.product_id, tagName);
      if (response.data) {
        setTags((prev) => [...prev, response.data]);
        // Refresh suggestions to update usage counts
        fetchTagSuggestions();
      }
    } catch (err) {
      setTagError(err.message || "Failed to add tag");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  // Remove a tag from the product (deletes immediately)
  const handleRemoveTag = async (tagId) => {
    setTagError("");
    try {
      await deleteProductTag(tagId);
      setTags((prev) => prev.filter((tag) => tag.tag_id !== tagId));
    } catch (err) {
      setTagError(err.message || "Failed to remove tag");
      setTimeout(() => setTagError(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const changes = getChangedProductFields(formData, product);

    if (Object.keys(changes).length === 0) {
      setErrors({ submit: "No changes to save" });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await onSave(product.product_id, changes);
      setSuccessMessage(SUCCESS_MESSAGES.PRODUCT_UPDATED);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrors({ submit: error.message || ERROR_MESSAGES.UPDATE_PRODUCT_ERROR });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
    setImages([]);
    setTags([]);
    setErrors({});
    setSuccessMessage("");
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    setImageSuccess("");
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
          <h2>Edit Product</h2>
          <CloseBtn onClick={handleClose} />
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="name">
                Product Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={errors.description ? styles.inputError : ""}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={errors.sku ? styles.inputError : ""}
                />
                {errors.sku && (
                  <span className={styles.errorText}>{errors.sku}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={errors.category_id ? styles.inputError : ""}
                >
                  <option value="">No Category</option>
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
                <label htmlFor="price">
                  Price ($) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={errors.price ? styles.inputError : ""}
                />
                {errors.price && (
                  <span className={styles.errorText}>{errors.price}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sale_price">Sale Price ($)</label>
                <input
                  type="number"
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity_available">
                  Stock Quantity <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="quantity_available"
                  name="quantity_available"
                  value={formData.quantity_available}
                  onChange={handleInputChange}
                  min="0"
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

          {/* Tags Management */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Product Tags</h3>
            <TagInput
              tags={tags}
              suggestions={tagSuggestions}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              placeholder="Add tags for search (e.g., wireless, bluetooth)..."
              maxTags={20}
            />
            {tagError && (
              <span className={styles.errorText}>{tagError}</span>
            )}
          </div>

          {/* Image Management */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              Product Images
              <span className={styles.imageCount}>
                ({images.length}/{PRODUCT_IMAGE_LIMIT})
              </span>
            </h3>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className={styles.imageGrid}>
                {images.map((image) => (
                  <div key={image.image_id} className={styles.imageCard}>
                    <img src={image.image_url} alt="Product" />
                    {image.is_primary && (
                      <span className={styles.primaryBadge}>Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleImageDelete(image.image_id)}
                      className={styles.deleteImageButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Image */}
            <div className={styles.imageUploadSection}>
              {images.length >= PRODUCT_IMAGE_LIMIT ? (
                <p className={styles.imageLimitReached}>
                  Maximum {PRODUCT_IMAGE_LIMIT} images reached. Delete an image to upload a new one.
                </p>
              ) : (
                <>
                  {imagePreview && (
                    <div className={styles.imagePreviewContainer}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        onClick={handleCancelImageSelection}
                        className={styles.cancelImageButton}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className={styles.uploadControls}>
                    <input
                      type="file"
                      id="product-image-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                    />
                    {imageFile && (
                      <UploadBtn
                        onClick={handleImageUpload}
                        loading={imageUploading}
                      >
                        Upload Image
                      </UploadBtn>
                    )}
                  </div>
                </>
              )}

              {imageError && (
                <span className={styles.errorText}>{imageError}</span>
              )}
              {imageSuccess && (
                <span className={styles.successText}>{imageSuccess}</span>
              )}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className={styles.errorMessage}>{errors.submit}</div>
          )}

          {/* Form Actions */}
          <div className={styles.modalFooter}>
            <CancelBtn onClick={handleClose} />
            <SaveBtn loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
