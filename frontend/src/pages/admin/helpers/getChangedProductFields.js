///////////////////////////////////////////////////////////////////////
// ============= GET CHANGED PRODUCT FIELDS ========================= //
///////////////////////////////////////////////////////////////////////

// Utility function to compare current form data with original product
// Returns only the fields that have changed

///////////////////////////////////////////////////////////////////////
// ====================== GET CHANGED FIELDS ========================= //
///////////////////////////////////////////////////////////////////////

/**
 * Compares form data with original product and returns changed fields
 * @param {Object} formData - Current form data
 * @param {Object} product - Original product data
 * @returns {Object} - Object containing only changed fields
 */
const getChangedProductFields = (formData, product) => {
  if (!product) return {};
  
  const changes = {};

  if (formData.name !== (product.product_name || "")) {
    changes.name = formData.name;
  }
  
  if (formData.description !== (product.product_description || "")) {
    changes.description = formData.description;
  }
  
  if (parseFloat(formData.price) !== parseFloat(product.price || 0)) {
    changes.price = parseFloat(formData.price);
  }
  
  if (formData.sale_price !== "" && parseFloat(formData.sale_price) !== parseFloat(product.sale_price || 0)) {
    changes.sale_price = parseFloat(formData.sale_price) || null;
  } else if (formData.sale_price === "" && product.sale_price) {
    changes.sale_price = null;
  }
  
  if (formData.sku !== (product.sku || "")) {
    changes.sku = formData.sku || null;
  }
  
  if (parseInt(formData.quantity_available) !== parseInt(product.quantity_available || 0)) {
    changes.quantity_available = parseInt(formData.quantity_available);
  }
  
  if (formData.category_id !== "" && parseInt(formData.category_id) !== parseInt(product.category_id || 0)) {
    changes.category_id = parseInt(formData.category_id) || null;
  }
  
  if (formData.brand !== (product.brand || "")) {
    changes.brand = formData.brand || null;
  }
  
  if (formData.is_featured !== (product.is_featured || false)) {
    changes.is_featured = formData.is_featured;
  }
  
  if (formData.is_active !== (product.is_active !== undefined ? product.is_active : true)) {
    changes.is_active = formData.is_active;
  }

  return changes;
};

export default getChangedProductFields;
