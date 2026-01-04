////////////////////////////////////////////////
// ======== ADMIN PRODUCT CONTROLLER ========= //
////////////////////////////////////////////////

// This controller handles admin HTTP requests for product management

// ======= Service Imports ======= //
const adminProductService = require("../services/adminProductService");

// ======= Model Imports (Sequelize) ======= //
const { Product, ProductImage, ProductCategory, Inventory, Wishlist } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

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

    // Validate sort fields
    const allowedSortFields = ["product_id", "product_name", "sku", "price", "created_at", "view_count", "rating_average", "rating_count"];
    const allowedSortOrders = ["asc", "desc"];
    
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = allowedSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : "DESC";

    // Build WHERE clause
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category_id) {
      whereConditions.category_id = category_id;
    }

    if (is_active !== undefined) {
      whereConditions.is_active = is_active === "true" || is_active === true;
    }

    if (is_featured !== undefined) {
      whereConditions.is_featured = is_featured === "true" || is_featured === true;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get products with includes
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Inventory,
          as: "inventory",
          attributes: ["quantity_available"],
        },
        {
          model: ProductCategory,
          as: "category",
          attributes: ["category_name"],
        },
      ],
      order: [[safeSortBy, safeSortOrder]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Get wishlist counts for these products
    const productIds = products.map(p => p.product_id);
    const wishlistCounts = await Wishlist.findAll({
      where: { product_id: { [Op.in]: productIds } },
      attributes: ["product_id", [fn("COUNT", col("wishlist_id")), "count"]],
      group: ["product_id"],
      raw: true,
    });

    const wishlistMap = {};
    wishlistCounts.forEach(w => {
      wishlistMap[w.product_id] = parseInt(w.count) || 0;
    });

    // Format response
    const formattedProducts = products.map(p => {
      const json = p.toJSON();
      return {
        ...json,
        quantity_available: json.inventory?.quantity_available || 0,
        category_name: json.category?.category_name || null,
        wishlist_count: wishlistMap[json.product_id] || 0,
      };
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.status(200).json({
      success: true,
      data: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages,
      },
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

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Inventory,
          as: "inventory",
          attributes: ["quantity_available", "quantity_reserved"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_id", "image_url", "image_alt_text", "is_primary", "display_order"],
          order: [["is_primary", "DESC"], ["display_order", "ASC"]],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: ADMIN_ERRORS.PRODUCT_NOT_FOUND });
    }

    const json = product.toJSON();
    const formattedProduct = {
      ...json,
      quantity_available: json.inventory?.quantity_available || 0,
      quantity_reserved: json.inventory?.quantity_reserved || 0,
      images: json.images || [],
    };

    res.status(200).json({ 
      success: true, 
      data: formattedProduct,
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
