////////////////////////////////////////////////
// ======== ADMIN PRODUCT CONTROLLER ========= //
////////////////////////////////////////////////

// This controller handles admin HTTP requests for product management

// ======= Service Imports ======= //
const adminProductService = require("../services/adminProductService");
const productModel = require("../model/productModel");

// ======= Constants Imports ======= //
const { ADMIN_SUCCESS, ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== CONTROLLER FUNCTIONS ==== //
///////////////////////////////////

// ===== getProducts Function ===== //
// GET /api/admin/products - List all products with pagination and filters

const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category_id, 
      is_active, 
      is_featured,
      sortBy = "created_at",
      sortOrder = "desc"
    } = req.query;

    // Validate sort fields to prevent SQL injection
    const allowedSortFields = ["product_id", "product_name", "sku", "price", "quantity_available", "created_at", "view_count", "rating_average", "rating_count"];
    const allowedSortOrders = ["asc", "desc"];
    
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = allowedSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : "desc";

    // Build query with JOIN to inventory table and wishlist count subquery
    let query = `
      SELECT 
        p.product_id, p.product_name, p.product_description, p.sku, p.brand,
        p.price, p.sale_price, p.category_id, p.is_active, p.is_featured,
        p.view_count, p.rating_average, p.rating_count,
        p.created_at, p.updated_at,
        COALESCE(i.quantity_available, 0) as quantity_available,
        c.category_name,
        (SELECT COUNT(*) FROM wishlist w WHERE w.product_id = p.product_id) as wishlist_count
      FROM products p
      LEFT JOIN inventory i ON p.product_id = i.product_id
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const values = [];

    if (search) {
      query += " AND (p.product_name LIKE ? OR p.sku LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += " AND p.category_id = ?";
      values.push(category_id);
    }

    if (is_active !== undefined) {
      query += " AND p.is_active = ?";
      values.push(is_active === "true" || is_active === true);
    }

    if (is_featured !== undefined) {
      query += " AND p.is_featured = ?";
      values.push(is_featured === "true" || is_featured === true);
    }

    // Handle sorting - prefix with table alias for ambiguous columns
    const sortField = safeSortBy === "quantity_available" ? "i.quantity_available" : `p.${safeSortBy}`;
    query += ` ORDER BY ${sortField} ${safeSortOrder.toUpperCase()} LIMIT ? OFFSET ?`;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    values.push(parseInt(limit), offset);

    // Execute query
    const db = require("../config/config").db;
    db.query(query, values, (err, products) => {
      if (err) {
        console.error("[adminProductController] Error fetching products:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      // Get total count for pagination
      let countQuery = "SELECT COUNT(*) as total FROM products p WHERE 1=1";
      const countValues = [];

      if (search) {
        countQuery += " AND (p.product_name LIKE ? OR p.sku LIKE ?)";
        countValues.push(`%${search}%`, `%${search}%`);
      }
      if (category_id) {
        countQuery += " AND p.category_id = ?";
        countValues.push(category_id);
      }
      if (is_active !== undefined) {
        countQuery += " AND p.is_active = ?";
        countValues.push(is_active === "true" || is_active === true);
      }
      if (is_featured !== undefined) {
        countQuery += " AND p.is_featured = ?";
        countValues.push(is_featured === "true" || is_featured === true);
      }

      db.query(countQuery, countValues, (err, countResults) => {
        if (err) {
          console.error("[adminProductController] Error counting products:", err);
          return res.status(500).json({ success: false, message: err.message });
        }

        const total = countResults[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
          success: true,
          data: products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
          },
        });
      });
    });
  } catch (error) {
    console.error("[adminProductController] Error in getProducts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== getProduct Function ===== //
// GET /api/admin/products/:productId - Get single product details

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const db = require("../config/config").db;

    // Get product with inventory data
    const productQuery = `
      SELECT 
        p.*,
        COALESCE(i.quantity_available, 0) as quantity_available,
        COALESCE(i.quantity_reserved, 0) as quantity_reserved
      FROM products p
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.product_id = ?
    `;

    db.query(productQuery, [productId], (err, productResults) => {
      if (err) {
        console.error("[adminProductController] Error fetching product:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!productResults || productResults.length === 0) {
        return res.status(404).json({ success: false, message: ADMIN_ERRORS.PRODUCT_NOT_FOUND });
      }

      const product = productResults[0];

      // Get product images
      const imagesQuery = `
        SELECT image_id, image_url, image_alt_text, is_primary, display_order
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_primary DESC, display_order ASC
      `;

      db.query(imagesQuery, [productId], (imgErr, images) => {
        if (imgErr) {
          console.error("[adminProductController] Error fetching images:", imgErr);
          // Return product without images if image fetch fails
          return res.status(200).json({ success: true, data: { ...product, images: [] } });
        }

        res.status(200).json({ 
          success: true, 
          data: { ...product, images: images || [] } 
        });
      });
    });
  } catch (error) {
    console.error("[adminProductController] Error in getProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== createProduct Function ===== //
// POST /api/admin/products - Create new product

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const product = await adminProductService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: ADMIN_SUCCESS.PRODUCT_CREATED,
      data: product,
    });
  } catch (error) {
    console.error("[adminProductController] Error creating product:", error);

    if (error.message === ADMIN_ERRORS.DUPLICATE_SKU) {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== updateProduct Function ===== //
// PATCH /api/admin/products/:productId - Update product

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = req.body;

    const product = await adminProductService.updateProduct(productId, productData);

    res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.PRODUCT_UPDATED,
      data: product,
    });
  } catch (error) {
    console.error("[adminProductController] Error updating product:", error);

    if (error.message === ADMIN_ERRORS.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (error.message === ADMIN_ERRORS.DUPLICATE_SKU) {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== deleteProduct Function ===== //
// DELETE /api/admin/products/:productId - Soft delete product

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await adminProductService.deleteProduct(productId);

    res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.PRODUCT_DELETED,
      data: result,
    });
  } catch (error) {
    console.error("[adminProductController] Error deleting product:", error);

    if (error.message === ADMIN_ERRORS.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== uploadImage Function ===== //
// POST /api/admin/products/:productId/images - Upload product image

const uploadImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { isPrimary } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: ADMIN_ERRORS.IMAGE_REQUIRED });
    }

    const filename = req.file.filename;
    const result = await adminProductService.uploadProductImage(
      productId,
      filename,
      isPrimary === "true" || isPrimary === true
    );

    res.status(201).json({
      success: true,
      message: ADMIN_SUCCESS.IMAGE_UPLOADED,
      data: result,
    });
  } catch (error) {
    console.error("[adminProductController] Error uploading image:", error);

    if (error.message === ADMIN_ERRORS.PRODUCT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== deleteImage Function ===== //
// DELETE /api/admin/products/images/:imageId - Delete product image

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const result = await adminProductService.deleteProductImage(imageId);

    res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.IMAGE_DELETED,
      data: result,
    });
  } catch (error) {
    console.error("[adminProductController] Error deleting image:", error);

    if (error.message === ADMIN_ERRORS.IMAGE_NOT_FOUND) {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

///////////////////////////////////
// ===== TAG CONTROLLER FUNCTIONS ==== //
///////////////////////////////////

// ===== getProductTags Function ===== //
// GET /api/admin/products/:productId/tags - Get all tags for a product

const getProductTags = async (req, res) => {
  try {
    const { productId } = req.params;
    const tags = await adminProductService.getProductTags(productId);

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("[adminProductController] Error fetching tags:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== addProductTag Function ===== //
// POST /api/admin/products/:productId/tags - Add a tag to a product

const addProductTag = async (req, res) => {
  try {
    const { productId } = req.params;
    const { tagName } = req.body;

    if (!tagName || typeof tagName !== "string") {
      return res.status(400).json({ success: false, message: "Tag name is required" });
    }

    const tag = await adminProductService.addProductTag(productId, tagName);

    res.status(201).json({
      success: true,
      message: "Tag added successfully",
      data: tag,
    });
  } catch (error) {
    console.error("[adminProductController] Error adding tag:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== addMultipleTags Function ===== //
// POST /api/admin/products/:productId/tags/bulk - Add multiple tags to a product

const addMultipleTags = async (req, res) => {
  try {
    const { productId } = req.params;
    const { tags } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ success: false, message: "Tags array is required" });
    }

    const results = await adminProductService.addMultipleTags(productId, tags);

    res.status(201).json({
      success: true,
      message: `${results.length} tags added successfully`,
      data: results,
    });
  } catch (error) {
    console.error("[adminProductController] Error adding multiple tags:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== deleteProductTag Function ===== //
// DELETE /api/admin/products/tags/:tagId - Delete a tag from a product

const deleteProductTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const result = await adminProductService.deleteProductTag(tagId);

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("[adminProductController] Error deleting tag:", error);

    if (error.message === "Tag not found") {
      return res.status(404).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== getAllTags Function ===== //
// GET /api/admin/tags - Get all unique tags (for autocomplete)

const getAllTags = async (req, res) => {
  try {
    const tags = await adminProductService.getAllTags();

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("[adminProductController] Error fetching all tags:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  getProductTags,
  addProductTag,
  addMultipleTags,
  deleteProductTag,
  getAllTags,
};
