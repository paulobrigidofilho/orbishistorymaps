///////////////////////////////////////////////////////////////////////
// =================== ADMIN PRODUCT FORM ============================ //
///////////////////////////////////////////////////////////////////////

// This page handles creating and editing products

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminProductForm.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";

//  ========== Function imports  ========== //
import getProductById from "../../functions/getProductById";
import createProduct from "../../functions/createProduct";
import updateProduct from "../../functions/updateProduct";
import uploadProductImage from "../../functions/uploadProductImage";
import deleteProductImage from "../../functions/deleteProductImage";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN PRODUCT FORM ========================== //
///////////////////////////////////////////////////////////////////////

export default function AdminProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!productId;

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
    is_featured: false,
    is_active: true,
  });

  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [productId]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      const product = response.data;

      setFormData({
        name: product.product_name || "",
        description: product.product_description || "",
        price: product.price || "",
        sale_price: product.sale_price || "",
        sku: product.sku || "",
        quantity_available: product.quantity_available || "",
        category_id: product.category_id || "",
        is_featured: product.is_featured || false,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });

      setImages(product.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateProduct(productId, formData);
        alert(SUCCESS_MESSAGES.PRODUCT_UPDATED);
      } else {
        const response = await createProduct(formData);
        alert(SUCCESS_MESSAGES.PRODUCT_CREATED);
        navigate(`/admin/products/edit/${response.data.product_id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !productId) return;

    setUploadingImage(true);
    try {
      await uploadProductImage(productId, imageFile, images.length === 0);
      setImageFile(null);
      fetchProduct(); // Refresh to get new images
      alert("Image uploaded successfully!");
    } catch (err) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteProductImage(imageId);
      fetchProduct(); // Refresh to update images
      alert("Image deleted successfully!");
    } catch (err) {
      alert(`Error deleting image: ${err.message}`);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.formPage}>
        <div className={styles.header}>
          <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Information */}
          <section className={styles.section}>
            <h2>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={styles.textarea}
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
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category_id">Category ID</label>
                <input
                  type="number"
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section className={styles.section}>
            <h2>Pricing & Inventory</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sale_price">Sale Price</label>
                <input
                  type="number"
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity_available">Stock Quantity *</label>
                <input
                  type="number"
                  id="quantity_available"
                  name="quantity_available"
                  value={formData.quantity_available}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Settings */}
          <section className={styles.section}>
            <h2>Settings</h2>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Featured Product
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Active (visible to customers)
              </label>
            </div>
          </section>

          {/* Submit Buttons */}
          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Image Management (only in edit mode) */}
        {isEditMode && (
          <section className={styles.imageSection}>
            <h2>Product Images</h2>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className={styles.imageGrid}>
                {images.map((image) => (
                  <div key={image.image_id} className={styles.imageCard}>
                    <img src={image.image_url} alt="Product" />
                    {image.is_primary && <span className={styles.primaryBadge}>Primary</span>}
                    <button
                      type="button"
                      onClick={() => handleImageDelete(image.image_id)}
                      className={styles.deleteImageButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload New Image */}
            <div className={styles.uploadSection}>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className={styles.fileInput}
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploadingImage}
                className={styles.uploadButton}
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
