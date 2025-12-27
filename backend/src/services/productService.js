//////////////////////////////////////////////////
// ============ PRODUCT SERVICE ================ //
//////////////////////////////////////////////////

// This service handles product-related business logic

// ======= Module Imports ======= //
const productModel = require("../model/productModel");

// ======= Constants Imports ======= //
const { PRODUCT_ERRORS } = require("../constants/errorMessages");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== getAllProducts Function ===== //
// Retrieves all products with optional filters

const getAllProducts = (filters) => {
  return new Promise((resolve, reject) => {
    productModel.getAllProducts(filters, (err, products) => {
      if (err) {
        return reject(new Error(PRODUCT_ERRORS.FETCH_FAILED));
      }
      resolve(products);
    });
  });
};

// ===== getProductDetails Function ===== //
// Retrieves detailed product information including images

const getProductDetails = async (identifier) => {
  return new Promise((resolve, reject) => {
    // Determine if identifier is UUID or slug
    const isUuid = identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    const method = isUuid ? 'getProductById' : 'getProductBySlug';

    productModel[method](identifier, (err, product) => {
      if (err) {
        return reject(new Error(PRODUCT_ERRORS.FETCH_FAILED));
      }

      if (!product) {
        return reject(new Error(PRODUCT_ERRORS.NOT_FOUND));
      }

      // Get product images
      productModel.getProductImages(product.product_id, (err, images) => {
        if (err) {
          console.warn("Failed to fetch product images:", err);
          product.images = [];
        } else {
          product.images = images;
        }

        // Increment view count (don't wait for it)
        productModel.incrementViewCount(product.product_id, () => {});

        resolve(product);
      });
    });
  });
};

// ===== createProduct Function ===== //
// Creates a new product (admin only)

const createProduct = async (productData) => {
  return new Promise((resolve, reject) => {
    const { v4: uuidv4 } = require("uuid");
    
    productData.product_id = uuidv4();
    productData.product_slug = productData.product_slug || 
      productData.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    productModel.createProduct(productData, (err, result) => {
      if (err) {
        return reject(new Error(PRODUCT_ERRORS.CREATE_FAILED));
      }
      resolve({ product_id: productData.product_id });
    });
  });
};

// ===== updateProduct Function ===== //
// Updates an existing product (admin only)

const updateProduct = async (productId, productData) => {
  return new Promise((resolve, reject) => {
    productModel.updateProduct(productId, productData, (err, result) => {
      if (err) {
        return reject(new Error(PRODUCT_ERRORS.UPDATE_FAILED));
      }

      if (result.affectedRows === 0) {
        return reject(new Error(PRODUCT_ERRORS.NOT_FOUND));
      }

      resolve({ message: "Product updated successfully" });
    });
  });
};

module.exports = {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
};
