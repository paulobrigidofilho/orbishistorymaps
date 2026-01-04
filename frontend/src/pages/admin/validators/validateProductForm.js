///////////////////////////////////////////////////////////////////////
// ================= VALIDATE PRODUCT FORM FUNCTION ================ //
///////////////////////////////////////////////////////////////////////

// This function validates product form data

//  ========== Constants imports  ========== //
import { PRODUCT_IMAGE_LIMIT } from "../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// ======================= VALIDATION FUNCTION ====================== //
///////////////////////////////////////////////////////////////////////

export default function validateProductForm(formData, imageCount = 0) {
  const errors = {};

  // ===== Name validation ===== //
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Product name is required";
  } else if (formData.name.length < 2) {
    errors.name = "Product name must be at least 2 characters";
  } else if (formData.name.length > 200) {
    errors.name = "Product name cannot exceed 200 characters";
  }

  // ===== Price validation ===== //
  if (!formData.price && formData.price !== 0) {
    errors.price = "Price is required";
  } else if (isNaN(parseFloat(formData.price))) {
    errors.price = "Price must be a valid number";
  } else if (parseFloat(formData.price) < 0) {
    errors.price = "Price cannot be negative";
  } else if (parseFloat(formData.price) > 999999.99) {
    errors.price = "Price cannot exceed NZD $999,999.99";
  }

  // ===== Sale Price validation (optional) ===== //
  if (formData.sale_price !== "" && formData.sale_price !== null && formData.sale_price !== undefined) {
    const salePrice = parseFloat(formData.sale_price);
    const regularPrice = parseFloat(formData.price);
    
    if (isNaN(salePrice)) {
      errors.sale_price = "Sale price must be a valid number";
    } else if (salePrice < 0) {
      errors.sale_price = "Sale price cannot be negative";
    } else if (salePrice >= regularPrice) {
      errors.sale_price = "Sale price must be less than regular price";
    }
  }

  // ===== Quantity validation ===== //
  if (formData.quantity_available === "" || formData.quantity_available === null || formData.quantity_available === undefined) {
    errors.quantity_available = "Stock quantity is required";
  } else if (isNaN(parseInt(formData.quantity_available))) {
    errors.quantity_available = "Stock quantity must be a valid number";
  } else if (parseInt(formData.quantity_available) < 0) {
    errors.quantity_available = "Stock quantity cannot be negative";
  } else if (parseInt(formData.quantity_available) > 999999) {
    errors.quantity_available = "Stock quantity cannot exceed 999,999";
  }

  // ===== SKU validation (optional) ===== //
  if (formData.sku && formData.sku.trim() !== "") {
    if (formData.sku.length > 50) {
      errors.sku = "SKU cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.sku)) {
      errors.sku = "SKU can only contain letters, numbers, hyphens, and underscores";
    }
  }

  // ===== Description validation (optional) ===== //
  if (formData.description && formData.description.length > 5000) {
    errors.description = "Description cannot exceed 5000 characters";
  }

  // ===== Brand validation (optional) ===== //
  if (formData.brand && formData.brand.length > 100) {
    errors.brand = "Brand name cannot exceed 100 characters";
  }

  // ===== Category ID validation (optional) ===== //
  if (formData.category_id !== "" && formData.category_id !== null && formData.category_id !== undefined) {
    if (isNaN(parseInt(formData.category_id))) {
      errors.category_id = "Category ID must be a valid number";
    }
  }

  // ===== Image count validation ===== //
  if (imageCount > PRODUCT_IMAGE_LIMIT) {
    errors.images = `Maximum ${PRODUCT_IMAGE_LIMIT} images allowed per product (Amazon standard)`;
  }

  return errors;
}
