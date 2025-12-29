// ======= Module imports ======= //
const db = require("../config/config").db;

///////////////////////////////////////////////////////////////////////
// ========================= PRODUCT MODEL ========================= //
///////////////////////////////////////////////////////////////////////

const productModel = {
  ///////////////////////////////////////////////////////////////////////
  // ==================== GET ALL PRODUCTS =========================== //
  ///////////////////////////////////////////////////////////////////////

  getAllProducts: (filters, callback) => {
    const { category, minPrice, maxPrice, search, featured, limit = 50, offset = 0 } = filters;
    
    let query = `
      SELECT 
        p.product_id, p.product_name, p.product_description, p.product_slug,
        p.category_id, p.brand, p.price, p.sale_price, p.currency, p.sku,
        p.is_active, p.is_featured, p.rating_average, p.rating_count,
        c.category_name,
        i.quantity_available,
        (SELECT image_url FROM product_images WHERE product_id = p.product_id AND is_primary = TRUE LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.is_active = TRUE`;
    
    const params = [];

    if (category) {
      query += ` AND p.category_id = ?`;
      params.push(category);
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(maxPrice);
    }

    if (search) {
      query += ` AND (p.product_name LIKE ? OR p.product_description LIKE ? OR p.brand LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (featured) {
      query += ` AND p.is_featured = TRUE`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET PRODUCT BY ID ========================== //
  ///////////////////////////////////////////////////////////////////////

  getProductById: (productId, callback) => {
    const query = `
      SELECT 
        p.*,
        c.category_name, c.category_slug,
        i.quantity_available, i.quantity_reserved
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.product_id = ? AND p.is_active = TRUE`;

    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results[0] || null);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET PRODUCT BY SLUG ======================== //
  ///////////////////////////////////////////////////////////////////////

  getProductBySlug: (slug, callback) => {
    const query = `
      SELECT 
        p.*,
        c.category_name, c.category_slug,
        i.quantity_available, i.quantity_reserved
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.product_slug = ? AND p.is_active = TRUE`;

    db.query(query, [slug], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results[0] || null);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET PRODUCT IMAGES ========================= //
  ///////////////////////////////////////////////////////////////////////

  getProductImages: (productId, callback) => {
    const query = `
      SELECT image_id, image_url, image_alt_text, is_primary, display_order
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, display_order ASC`;

    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== INCREMENT VIEW COUNT ======================= //
  ///////////////////////////////////////////////////////////////////////

  incrementViewCount: (productId, callback) => {
    const query = `UPDATE products SET view_count = view_count + 1 WHERE product_id = ?`;

    db.query(query, [productId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== CREATE PRODUCT ============================= //
  ///////////////////////////////////////////////////////////////////////

  createProduct: (productData, callback) => {
    const query = `
      INSERT INTO products (
        product_id, product_name, product_description, product_details, product_slug,
        category_id, brand, price, sale_price, currency, sku, weight, dimensions,
        is_active, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        productData.product_id,
        productData.product_name,
        productData.product_description,
        productData.product_details,
        productData.product_slug,
        productData.category_id,
        productData.brand,
        productData.price,
        productData.sale_price,
        productData.currency,
        productData.sku,
        productData.weight,
        productData.dimensions,
        productData.is_active,
        productData.is_featured,
      ],
      (err, result) => {
        if (err) {
          console.error("Database INSERT error:", err);
          return callback(err, null);
        }
        console.log("Product created successfully");
        return callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== UPDATE PRODUCT ============================= //
  ///////////////////////////////////////////////////////////////////////

  updateProduct: (productId, productData, callback) => {
    const query = `
      UPDATE products SET
        product_name = ?, product_description = ?, product_details = ?,
        category_id = ?, brand = ?, price = ?, sale_price = ?,
        weight = ?, dimensions = ?, is_active = ?, is_featured = ?
      WHERE product_id = ?`;

    db.query(
      query,
      [
        productData.product_name,
        productData.product_description,
        productData.product_details,
        productData.category_id,
        productData.brand,
        productData.price,
        productData.sale_price,
        productData.weight,
        productData.dimensions,
        productData.is_active,
        productData.is_featured,
        productId,
      ],
      (err, result) => {
        if (err) {
          console.error("Database UPDATE error:", err);
          return callback(err, null);
        }
        return callback(null, result);
      }
    );
  },
};

module.exports = productModel;
