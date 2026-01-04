///////////////////////////////////////////////////////////////////////
// ================ ADMIN PRODUCT SERVICE (SEQUELIZE) ============== //
///////////////////////////////////////////////////////////////////////

// This service manages admin operations for product management (CRUD)

// ======= Module Imports ======= //
const path = require("path");
const fs = require("fs").promises;
const { Op, fn, col, literal } = require("sequelize");

// ======= Model Imports ======= //
const { Product, ProductImage, ProductTag, Inventory } = require("../models");

// ======= Helper Imports ======= //
const { compressProductImage, deleteProductImages } = require("../helpers/compressProductImage");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== createProduct Function ===== //
// Creates a new product with all details

const createProduct = async (productData) => {
  // Check for duplicate SKU if provided
  if (productData.sku) {
    const existingSku = await Product.findOne({
      where: { sku: productData.sku },
    });
    if (existingSku) {
      throw new Error(ADMIN_ERRORS.DUPLICATE_SKU);
    }
  }

  // Generate slug from name
  const slug = productData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Create product
  const product = await Product.create({
    product_name: productData.name,
    product_description: productData.description || null,
    product_slug: slug,
    price: productData.price,
    sale_price: productData.sale_price || null,
    sku: productData.sku || null,
    brand: productData.brand || null,
    category_id: productData.category_id || null,
    is_featured: productData.is_featured || false,
    is_active: productData.is_active !== undefined ? productData.is_active : true,
  });

  console.log(`[adminProductService] Product created with ID: ${product.product_id}`);

  // Create inventory record for the new product
  const inventoryQuantity = productData.quantity_available || 0;
  await Inventory.create({
    product_id: product.product_id,
    quantity_available: inventoryQuantity,
    quantity_reserved: 0,
  });

  // Fetch created product with inventory
  const result = await Product.findByPk(product.product_id, {
    include: [
      {
        model: Inventory,
        as: "inventory",
        attributes: ["quantity_available"],
      },
    ],
  });

  return {
    ...result.toJSON(),
    quantity_available: result.inventory?.quantity_available || 0,
  };
};

// ===== updateProduct Function ===== //
// Updates existing product details

const updateProduct = async (productId, productData) => {
  // Check for duplicate SKU if being updated
  if (productData.sku) {
    const existingSku = await Product.findOne({
      where: {
        sku: productData.sku,
        product_id: { [Op.ne]: productId },
      },
    });
    if (existingSku) {
      throw new Error(ADMIN_ERRORS.DUPLICATE_SKU);
    }
  }

  const updateData = {};

  // Fields that belong to the products table
  const fieldMap = {
    name: "product_name",
    description: "product_description",
    price: "price",
    sale_price: "sale_price",
    sku: "sku",
    brand: "brand",
    category_id: "category_id",
    is_featured: "is_featured",
    is_active: "is_active",
  };

  for (const [key, dbField] of Object.entries(fieldMap)) {
    if (productData[key] !== undefined) {
      updateData[dbField] = productData[key];
    }
  }

  // Update slug if name changed
  if (productData.name) {
    updateData.product_slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Handle inventory update
  const updateInventory = productData.quantity_available !== undefined;
  const inventoryQuantity = productData.quantity_available;

  // If no product updates and no inventory update, reject
  if (Object.keys(updateData).length === 0 && !updateInventory) {
    throw new Error(ADMIN_ERRORS.PRODUCT_UPDATE_FAILED);
  }

  // Update product if there are fields to update
  if (Object.keys(updateData).length > 0) {
    const [updated] = await Product.update(updateData, {
      where: { product_id: productId },
    });

    if (updated === 0) {
      throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND);
    }
  }

  // Update inventory if needed
  if (updateInventory) {
    const [inventoryUpdated] = await Inventory.update(
      { quantity_available: inventoryQuantity },
      { where: { product_id: productId } }
    );

    // If no inventory record exists, create one
    if (inventoryUpdated === 0) {
      await Inventory.create({
        product_id: productId,
        quantity_available: inventoryQuantity,
      });
    }
  }

  // Fetch updated product with inventory
  const result = await Product.findByPk(productId, {
    include: [
      {
        model: Inventory,
        as: "inventory",
        attributes: ["quantity_available"],
      },
    ],
  });

  return {
    ...result.toJSON(),
    quantity_available: result.inventory?.quantity_available || 0,
  };
};

// ===== deleteProduct Function ===== //
// Soft delete product (set is_active = false)

const deleteProduct = async (productId) => {
  const [updated] = await Product.update(
    { is_active: false },
    { where: { product_id: productId } }
  );

  if (updated === 0) {
    throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND);
  }

  console.log(`[adminProductService] Product ${productId} soft deleted`);
  return { productId, deleted: true };
};

// ===== uploadProductImage Function ===== //
// Uploads and processes product image, creating multiple sizes

const uploadProductImage = async (productId, filename, isPrimary = false) => {
  // Verify product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND);
  }

  const absolutePath = path.resolve(__dirname, "../../uploads/products", filename);

  // Compress image to multiple sizes
  const compressionResult = await compressProductImage(absolutePath);
  const primaryFilename = compressionResult.primaryFilename;

  // Construct URL for the large (primary) image
  const base = process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") || "http://localhost:4000";
  const imageUrl = `${base}/uploads/products/${primaryFilename}`;

  // Insert image record into database
  const image = await ProductImage.create({
    product_id: productId,
    image_url: imageUrl,
    is_primary: isPrimary,
  });

  console.log(`[adminProductService] Image uploaded for product ${productId}, image ID: ${image.image_id}`);

  return {
    imageId: image.image_id,
    imageUrl,
    isPrimary,
    sizes: compressionResult.images,
  };
};

// ===== deleteProductImage Function ===== //
// Deletes product image and all its size variants

const deleteProductImage = async (imageId) => {
  // Get image info
  const image = await ProductImage.findByPk(imageId);

  if (!image) {
    throw new Error(ADMIN_ERRORS.IMAGE_NOT_FOUND);
  }

  const filename = path.basename(image.image_url);

  // Delete all size variants from disk
  await deleteProductImages(filename);

  // Delete from database
  await image.destroy();

  console.log(`[adminProductService] Image ${imageId} deleted`);
  return { imageId, deleted: true };
};

///////////////////////////////////////////////////////////////////////
// ================ TAG MANAGEMENT ================================= //
///////////////////////////////////////////////////////////////////////

// ===== getProductTags Function ===== //
// Retrieves all tags for a specific product

const getProductTags = async (productId) => {
  const tags = await ProductTag.findAll({
    where: { product_id: productId },
    order: [["tag_name", "ASC"]],
  });

  return tags.map((tag) => tag.toJSON());
};

// ===== addProductTag Function ===== //
// Adds a tag to a product (ignores duplicates)

const addProductTag = async (productId, tagName) => {
  // Normalize tag name (lowercase, trimmed)
  const normalizedTag = tagName.trim().toLowerCase();

  if (!normalizedTag || normalizedTag.length > 50) {
    throw new Error("Tag must be between 1 and 50 characters");
  }

  // Use findOrCreate to handle duplicates
  const [tag] = await ProductTag.findOrCreate({
    where: { product_id: productId, tag_name: normalizedTag },
    defaults: { product_id: productId, tag_name: normalizedTag },
  });

  return tag.toJSON();
};

// ===== addMultipleTags Function ===== //
// Adds multiple tags to a product at once

const addMultipleTags = async (productId, tagNames) => {
  const results = [];
  for (const tagName of tagNames) {
    const tag = await addProductTag(productId, tagName);
    results.push(tag);
  }
  return results;
};

// ===== deleteProductTag Function ===== //
// Removes a tag from a product

const deleteProductTag = async (tagId) => {
  const deleted = await ProductTag.destroy({ where: { tag_id: tagId } });

  if (deleted === 0) {
    throw new Error("Tag not found");
  }

  return { tagId, deleted: true };
};

// ===== getAllTags Function ===== //
// Gets all unique tags across all products (for autocomplete)

const getAllTags = async () => {
  const tags = await ProductTag.findAll({
    attributes: [
      "tag_name",
      [fn("COUNT", col("tag_id")), "usage_count"],
    ],
    group: ["tag_name"],
    order: [
      [literal("usage_count"), "DESC"],
      ["tag_name", "ASC"],
    ],
    limit: 100,
  });

  return tags.map((tag) => tag.toJSON());
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  getProductTags,
  addProductTag,
  addMultipleTags,
  deleteProductTag,
  getAllTags,
};
