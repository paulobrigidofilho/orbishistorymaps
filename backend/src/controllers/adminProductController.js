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
    const { page = 1, limit = 10, search, category_id, is_active, is_featured } = req.query;

    // Build query dynamically
    let query = "SELECT * FROM products WHERE 1=1";
    const values = [];

    if (search) {
      query += " AND (product_name LIKE ? OR sku LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += " AND category_id = ?";
      values.push(category_id);
    }

    if (is_active !== undefined) {
      query += " AND is_active = ?";
      values.push(is_active === "true" || is_active === true);
    }

    if (is_featured !== undefined) {
      query += " AND is_featured = ?";
      values.push(is_featured === "true" || is_featured === true);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
      let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
      const countValues = [];

      if (search) {
        countQuery += " AND (product_name LIKE ? OR sku LIKE ?)";
        countValues.push(`%${search}%`, `%${search}%`);
      }
      if (category_id) {
        countQuery += " AND category_id = ?";
        countValues.push(category_id);
      }
      if (is_active !== undefined) {
        countQuery += " AND is_active = ?";
        countValues.push(is_active === "true" || is_active === true);
      }
      if (is_featured !== undefined) {
        countQuery += " AND is_featured = ?";
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

    productModel.getProductById(productId, (err, product) => {
      if (err) {
        console.error("[adminProductController] Error fetching product:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      if (!product) {
        return res.status(404).json({ success: false, message: ADMIN_ERRORS.PRODUCT_NOT_FOUND });
      }

      res.status(200).json({ success: true, data: product });
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

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
};
