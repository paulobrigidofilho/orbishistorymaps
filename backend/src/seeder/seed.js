//////////////////////////////////////////////////////////////
// =============== ORBIS APP - DATABASE SEEDER ============ //
// =================== VERSION 1.0 ======================== //
//////////////////////////////////////////////////////////////

// This script sets up the initial database schema and seeds an admin user.
// Tables: users, sessions, password_resets

// ======= Package Imports ======== //
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

(async () => {
  console.log("Starting seeding...");

  // Validate required env vars
  const required = [
    "MYSQL_HOST",
    "MYSQL_USER",
    "MYSQL_PASSWORD",
    "MYSQL_DATABASE",
  ];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required env var ${key}. Aborting.`);
      process.exit(1);
    }
  }

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  let hadError = false;

  try {
    // ===== Create Users Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(64) PRIMARY KEY,
        user_firstname VARCHAR(100) NOT NULL,
        user_lastname VARCHAR(100) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_password VARCHAR(255) NOT NULL,
        user_nickname VARCHAR(100),
        user_avatar VARCHAR(255),
        user_address VARCHAR(255),
        user_address_line_2 VARCHAR(255),
        user_city VARCHAR(100),
        user_state VARCHAR(100),
        user_zipcode VARCHAR(20),
        user_role ENUM('user', 'admin') DEFAULT 'user',
        user_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_role (user_role),
        INDEX idx_status (user_status),
        INDEX idx_email (user_email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Users table ensured.");

    // ===== Create Password Resets Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        reset_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        reset_token VARCHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        used_at DATETIME DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_reset_token (reset_token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Password resets table ensured.");

    // ===== Create Product Categories Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        category_description TEXT,
        category_image VARCHAR(255),
        parent_category_id INT,
        category_slug VARCHAR(150) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_category_id) REFERENCES product_categories(category_id) ON DELETE SET NULL,
        INDEX idx_parent_category (parent_category_id),
        INDEX idx_slug (category_slug),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Product categories table ensured.");

    // ===== Create Products Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        product_id VARCHAR(36) PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_description TEXT,
        product_details TEXT,
        product_slug VARCHAR(300) NOT NULL UNIQUE,
        category_id INT,
        brand VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        sale_price DECIMAL(10, 2),
        currency VARCHAR(3) DEFAULT 'USD',
        sku VARCHAR(100) UNIQUE,
        weight DECIMAL(10, 2),
        dimensions VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        rating_average DECIMAL(3, 2) DEFAULT 0.00,
        rating_count INT DEFAULT 0,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES product_categories(category_id) ON DELETE SET NULL,
        INDEX idx_category (category_id),
        INDEX idx_slug (product_slug),
        INDEX idx_sku (sku),
        INDEX idx_active (is_active),
        INDEX idx_featured (is_featured),
        INDEX idx_price (price)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Products table ensured.");

    // ===== Create Product Images Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        image_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        image_alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        INDEX idx_product (product_id),
        INDEX idx_primary (is_primary)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Product images table ensured.");

    // ===== Create Product Tags Table ===== //
    // Supports flexible tagging for advanced search and filtering
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_tags (
        tag_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NOT NULL,
        tag_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        INDEX idx_product (product_id),
        INDEX idx_tag_name (tag_name),
        UNIQUE KEY unique_product_tag (product_id, tag_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Product tags table ensured.");

    // ===== Create Inventory Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inventory (
        inventory_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NOT NULL UNIQUE,
        quantity_available INT NOT NULL DEFAULT 0,
        quantity_reserved INT NOT NULL DEFAULT 0,
        low_stock_threshold INT DEFAULT 10,
        reorder_quantity INT DEFAULT 50,
        last_restocked_at TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        INDEX idx_product (product_id),
        INDEX idx_quantity (quantity_available)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Inventory table ensured.");

    // ===== Create Addresses Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS addresses (
        address_id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        address_type ENUM('shipping', 'billing') NOT NULL,
        recipient_name VARCHAR(200) NOT NULL,
        address_line_1 VARCHAR(255) NOT NULL,
        address_line_2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'USA',
        phone_number VARCHAR(20),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_type (address_type),
        INDEX idx_default (is_default)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Addresses table ensured.");

    // ===== Create Shopping Cart Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        cart_id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(64),
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_session (session_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Shopping cart table ensured.");

    // ===== Create Cart Items Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart_items (
        cart_item_id VARCHAR(36) PRIMARY KEY,
        cart_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price_at_addition DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        INDEX idx_cart (cart_id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Cart items table ensured.");

    // ===== Create Orders Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) DEFAULT 0.00,
        shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
        discount_amount DECIMAL(10, 2) DEFAULT 0.00,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        shipping_address_id VARCHAR(36),
        billing_address_id VARCHAR(36),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
        FOREIGN KEY (shipping_address_id) REFERENCES addresses(address_id) ON DELETE SET NULL,
        FOREIGN KEY (billing_address_id) REFERENCES addresses(address_id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_order_number (order_number),
        INDEX idx_status (order_status),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Orders table ensured.");

    // ===== Create Order Items Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_item_id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_sku VARCHAR(100),
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
        INDEX idx_order (order_id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Order items table ensured.");

    // ===== Create Payments Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        payment_gateway VARCHAR(50),
        gateway_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        INDEX idx_order (order_id),
        INDEX idx_transaction (transaction_id),
        INDEX idx_status (payment_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Payments table ensured.");

    // ===== Create Product Reviews Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        review_id VARCHAR(36) PRIMARY KEY,
        product_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        order_id VARCHAR(36),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_title VARCHAR(255),
        review_text TEXT,
        is_verified_purchase BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT FALSE,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
        INDEX idx_product (product_id),
        INDEX idx_user (user_id),
        INDEX idx_rating (rating),
        INDEX idx_approved (is_approved)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Product reviews table ensured.");

    // ===== Create Wishlist Table ===== //
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        wishlist_id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user (user_id),
        INDEX idx_product (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Wishlist table ensured.");

    // ===== Seed Users from mock-users.json ===== //
    const mockUsersPath = path.join(__dirname, '..', 'db', 'mock-users.json');
    if (fs.existsSync(mockUsersPath)) {
      try {
        const fileContent = fs.readFileSync(mockUsersPath, 'utf8').trim();
        if (!fileContent) {
          console.log("mock-users.json is empty, skipping user seeding.");
        } else {
          const mockUsers = JSON.parse(fileContent);
          for (const user of mockUsers) {
            // Check if user already exists
            const [existing] = await connection.execute(
              'SELECT user_id FROM users WHERE user_email = ?',
              [user.user_email]
            );
            if (existing.length === 0) {
              await connection.execute(
                `INSERT INTO users (user_id, user_firstname, user_lastname, user_email, user_password, user_nickname, user_avatar, user_address, user_address_line_2, user_city, user_state, user_zipcode, user_role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  user.user_id,
                  user.user_firstname,
                  user.user_lastname,
                  user.user_email,
                  user.user_password,
                  user.user_nickname || null,
                  user.user_avatar || null,
                  user.user_address || null,
                  user.user_address_line_2 || null,
                  user.user_city || null,
                  user.user_state || null,
                  user.user_zipcode || null,
                  user.user_role || 'user'
                ]
              );
              console.log(`User ${user.user_email} seeded.`);
            } else {
              console.log(`User ${user.user_email} already exists.`);
            }
          }
        }
      } catch (err) {
        console.log("Error parsing mock-users.json, skipping user seeding:", err.message);
      }
    } else {
      console.log("mock-users.json not found, skipping user seeding.");
    }

    // ===== Seed Products from mock-products.json ===== //
    const mockProductsPath = path.join(__dirname, '..', 'db', 'mock-products.json');
    if (fs.existsSync(mockProductsPath)) {
      try {
        const fileContent = fs.readFileSync(mockProductsPath, 'utf8').trim();
        if (!fileContent) {
          console.log("mock-products.json is empty, skipping product seeding.");
        } else {
          const mockProducts = JSON.parse(fileContent);
          for (const product of mockProducts) {
            const slug = (product.product_name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            // Check if product already exists
            const [existing] = await connection.execute(
              'SELECT product_id FROM products WHERE product_slug = ?',
              [slug]
            );
            if (existing.length > 0) {
              console.log(`Product ${product.product_name} already exists, skipping.`);
              continue;
            }
            let categoryId = null;
            if (product.category_name) {
              const [catRows] = await connection.execute(
                'SELECT category_id FROM product_categories WHERE category_name = ?',
                [product.category_name]
              );
              if (catRows.length > 0) {
                categoryId = catRows[0].category_id;
              } else {
                const slug = product.category_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const result = await connection.execute(
                  'INSERT INTO product_categories (category_name, category_slug) VALUES (?, ?)',
                  [product.category_name, slug]
                );
                categoryId = result[0].insertId;
              }
            }

            // Insert product
            const productId = uuidv4();
            await connection.execute(
              `INSERT INTO products (product_id, product_name, product_description, product_slug, category_id, brand, price, currency, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 'USD', TRUE)`,
              [productId, product.product_name, product.product_description || '', slug, categoryId, product.brand || '', product.price || 0]
            );

            // Insert images
            if (product.images && Array.isArray(product.images)) {
              for (let i = 0; i < product.images.length; i++) {
                await connection.execute(
                  'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
                  [productId, product.images[i], i === 0, i]
                );
              }
            }

            // Insert tags
            if (product.tags && Array.isArray(product.tags)) {
              for (const tag of product.tags) {
                await connection.execute(
                  'INSERT INTO product_tags (product_id, tag_name) VALUES (?, ?)',
                  [productId, tag]
                );
              }
            }

            // Insert inventory
            const qty = product.quantity_available || 0;
            await connection.execute(
              'INSERT INTO inventory (product_id, quantity_available) VALUES (?, ?)',
              [productId, qty]
            );
          }
          console.log("✓ Products seeded from mock-products.json.");
        }
      } catch (err) {
        console.log("Error parsing mock-products.json, skipping product seeding:", err.message);
      }
    } else {
      console.log("mock-products.json not found, skipping product seeding.");
    }

    console.log("\n✓ Seeding completed successfully!");
  } catch (err) {
    console.error("\n❌ Seeding error:", err);
    hadError = true;
  } finally {
    await connection.end();
    console.log("Seeding script finished.");
    process.exit(hadError ? 1 : 0);
  }
})();
