////////////////////////////////////////////////
// ======== ADMIN PRODUCT SERVICE =========== //
////////////////////////////////////////////////

// This service manages admin operations for product management (CRUD)

// ======= Module Imports ======= //
const db = require("../config/config").db;
const path = require("path");
const fs = require("fs").promises;

// ======= Model Imports ======= //
const productModel = require("../model/productModel");

// ======= Helper Imports ======= //
const { compressProductImage, deleteProductImages } = require("../helpers/compressProductImage");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== createProduct Function ===== //
// Creates a new product with all details

const createProduct = async (productData) => {
  return new Promise((resolve, reject) => {
    // Check for duplicate SKU if provided
    if (productData.sku) {
      const checkSkuQuery = "SELECT product_id FROM products WHERE sku = ?";
      db.query(checkSkuQuery, [productData.sku], (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) {
          return reject(new Error(ADMIN_ERRORS.DUPLICATE_SKU));
        }
        proceedWithInsert();
      });
    } else {
      proceedWithInsert();
    }

    function proceedWithInsert() {
      // Generate slug from name
      const slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const query = `
        INSERT INTO products (
          product_name,
          product_description,
          product_slug,
          price,
          sale_price,
          sku,
          brand,
          category_id,
          is_featured,
          is_active,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        productData.name,
        productData.description || null,
        slug,
        productData.price,
        productData.sale_price || null,
        productData.sku || null,
        productData.brand || null,
        productData.category_id || null,
        productData.is_featured || false,
        productData.is_active !== undefined ? productData.is_active : true,
      ];

      db.query(query, values, (err, result) => {
        if (err) return reject(err);

        const productId = result.insertId;
        console.log(`[adminProductService] Product created with ID: ${productId}`);

        // Create inventory record for the new product
        const inventoryQuantity = productData.quantity_available || 0;
        const inventoryQuery = `
          INSERT INTO inventory (product_id, quantity_available, quantity_reserved, created_at, updated_at)
          VALUES (?, ?, 0, NOW(), NOW())
        `;

        db.query(inventoryQuery, [productId, inventoryQuantity], (err) => {
          if (err) {
            console.error(`[adminProductService] Failed to create inventory for product ${productId}:`, err);
            // Continue anyway - inventory can be added later
          }

          // Fetch created product with inventory
          const fetchQuery = `
            SELECT p.*, COALESCE(i.quantity_available, 0) as quantity_available
            FROM products p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE p.product_id = ?
          `;
          db.query(fetchQuery, [productId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          });
        });
      });
    }
  });
};

// ===== updateProduct Function ===== //
// Updates existing product details

const updateProduct = async (productId, productData) => {
  return new Promise((resolve, reject) => {
    // Check for duplicate SKU if being updated
    if (productData.sku) {
      const checkSkuQuery = "SELECT product_id FROM products WHERE sku = ? AND product_id != ?";
      db.query(checkSkuQuery, [productData.sku, productId], (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) {
          return reject(new Error(ADMIN_ERRORS.DUPLICATE_SKU));
        }
        proceedWithUpdate();
      });
    } else {
      proceedWithUpdate();
    }

    function proceedWithUpdate() {
      // Build dynamic UPDATE query for products table
      const updates = [];
      const values = [];

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
          updates.push(`${dbField} = ?`);
          values.push(productData[key]);
        }
      }

      // Update slug if name changed
      if (productData.name) {
        const slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        updates.push("product_slug = ?");
        values.push(slug);
      }

      // Handle inventory update separately if quantity_available is provided
      const updateInventory = productData.quantity_available !== undefined;
      const inventoryQuantity = productData.quantity_available;

      // If no product updates and no inventory update, reject
      if (updates.length === 0 && !updateInventory) {
        return reject(new Error(ADMIN_ERRORS.PRODUCT_UPDATE_FAILED));
      }

      // Function to update inventory
      const handleInventoryUpdate = (callback) => {
        if (!updateInventory) {
          return callback();
        }

        // Check if inventory record exists
        const checkInventoryQuery = "SELECT inventory_id FROM inventory WHERE product_id = ?";
        db.query(checkInventoryQuery, [productId], (err, results) => {
          if (err) return reject(err);

          if (results.length > 0) {
            // Update existing inventory
            const updateInvQuery = "UPDATE inventory SET quantity_available = ?, updated_at = NOW() WHERE product_id = ?";
            db.query(updateInvQuery, [inventoryQuantity, productId], (err) => {
              if (err) return reject(err);
              callback();
            });
          } else {
            // Insert new inventory record
            const insertInvQuery = "INSERT INTO inventory (product_id, quantity_available, created_at, updated_at) VALUES (?, ?, NOW(), NOW())";
            db.query(insertInvQuery, [productId, inventoryQuantity], (err) => {
              if (err) return reject(err);
              callback();
            });
          }
        });
      };

      // Function to update product
      const handleProductUpdate = (callback) => {
        if (updates.length === 0) {
          return callback();
        }

        updates.push("updated_at = NOW()");
        values.push(productId);

        const query = `UPDATE products SET ${updates.join(", ")} WHERE product_id = ?`;

        db.query(query, values, (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 0) {
            return reject(new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND));
          }
          callback();
        });
      };

      // Execute updates
      handleProductUpdate(() => {
        handleInventoryUpdate(() => {
          // Fetch updated product with inventory
          const fetchQuery = `
            SELECT p.*, COALESCE(i.quantity_available, 0) as quantity_available
            FROM products p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            WHERE p.product_id = ?
          `;
          db.query(fetchQuery, [productId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
          });
        });
      });
    }
  });
};

// ===== deleteProduct Function ===== //
// Soft delete product (set is_active = false)

const deleteProduct = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE products SET is_active = false, updated_at = NOW() WHERE product_id = ?";

    db.query(query, [productId], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND));
      }

      console.log(`[adminProductService] Product ${productId} soft deleted`);
      resolve({ productId, deleted: true });
    });
  });
};

// ===== uploadProductImage Function ===== //
// Uploads and processes product image, creating multiple sizes

const uploadProductImage = async (productId, filename, isPrimary = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Verify product exists
      productModel.getProductById(productId, async (err, product) => {
        if (err) return reject(err);
        if (!product) return reject(new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND));

        const absolutePath = path.resolve(__dirname, "../../uploads/products", filename);

        // Compress image to multiple sizes
        const compressionResult = await compressProductImage(absolutePath);
        const primaryFilename = compressionResult.primaryFilename;

        // Construct URL for the large (primary) image
        const base = process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") || "http://localhost:4000";
        const imageUrl = `${base}/uploads/products/${primaryFilename}`;

        // Insert image record into database
        const query = `
          INSERT INTO product_images (product_id, image_url, is_primary, created_at)
          VALUES (?, ?, ?, NOW())
        `;

        db.query(query, [productId, imageUrl, isPrimary], (err, result) => {
          if (err) return reject(err);

          const imageId = result.insertId;
          console.log(`[adminProductService] Image uploaded for product ${productId}, image ID: ${imageId}`);

          resolve({
            imageId,
            imageUrl,
            isPrimary,
            sizes: compressionResult.images,
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

// ===== deleteProductImage Function ===== //
// Deletes product image and all its size variants

const deleteProductImage = async (imageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get image info
      const getImageQuery = "SELECT image_url FROM product_images WHERE image_id = ?";

      db.query(getImageQuery, [imageId], async (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return reject(new Error(ADMIN_ERRORS.IMAGE_NOT_FOUND));
        }

        const imageUrl = results[0].image_url;
        const filename = path.basename(imageUrl);

        // Delete all size variants from disk
        await deleteProductImages(filename);

        // Delete from database
        const deleteQuery = "DELETE FROM product_images WHERE image_id = ?";
        db.query(deleteQuery, [imageId], (err, result) => {
          if (err) return reject(err);

          console.log(`[adminProductService] Image ${imageId} deleted`);
          resolve({ imageId, deleted: true });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};
