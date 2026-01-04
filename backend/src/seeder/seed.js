//////////////////////////////////////////////////////////////
// =============== ORBIS APP - DATABASE SEEDER ============ //
// =================== VERSION 2.0 ======================== //
//////////////////////////////////////////////////////////////

// This script sets up the initial database schema using Sequelize
// and seeds initial data from mock JSON files.

// ======= Package Imports ======== //
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
});

// ======= Model Imports ======== //
const {
  sequelize,
  syncDatabase,
  User,
  ProductCategory,
  Product,
  ProductImage,
  ProductTag,
  Inventory,
  SiteSettings,
  FreightConfig,
  Post,
} = require("../models");

(async () => {
  console.log("Starting seeding with Sequelize...\n");

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

  let hadError = false;

  try {
    // ===== Authenticate Database Connection ===== //
    await sequelize.authenticate();
    console.log("✓ Database connection established.");

    // ===== Sync All Models (Create Tables) ===== //
    // Using alter:false to preserve existing data, force:false to not drop tables
    await syncDatabase({ force: false, alter: false });
    console.log("✓ All tables ensured via Sequelize sync.\n");

    // ===== Seed Users from mock-users.json ===== //
    const mockUsersPath = path.join(__dirname, "..", "db", "mock-users.json");
    if (fs.existsSync(mockUsersPath)) {
      try {
        const fileContent = fs.readFileSync(mockUsersPath, "utf8").trim();
        if (!fileContent) {
          console.log("mock-users.json is empty, skipping user seeding.");
        } else {
          const mockUsers = JSON.parse(fileContent);
          console.log(`Found ${mockUsers.length} users in mock-users.json`);
          
          for (const userData of mockUsers) {
            // Check if user already exists
            const existing = await User.findOne({
              where: { user_email: userData.user_email },
            });

            if (!existing) {
              await User.create({
                user_id: userData.user_id,
                user_firstname: userData.user_firstname,
                user_lastname: userData.user_lastname,
                user_email: userData.user_email,
                user_password: userData.user_password,
                user_nickname: userData.user_nickname || null,
                user_avatar: userData.user_avatar || null,
                user_address: userData.user_address || null,
                user_address_line_2: userData.user_address_line_2 || null,
                user_city: userData.user_city || null,
                user_state: userData.user_state || null,
                user_zipcode: userData.user_zipcode || null,
                user_country: userData.user_country || "New Zealand",
                user_google_place_id: userData.user_google_place_id || null,
                user_formatted_address: userData.user_formatted_address || null,
                user_freight_zone: userData.user_freight_zone || null,
                user_is_tauranga: userData.user_is_tauranga || false,
                user_role: userData.user_role || "user",
                user_status: userData.user_status || "active",
              });
              console.log(`  ✓ User ${userData.user_email} seeded.`);
            } else {
              console.log(`  - User ${userData.user_email} already exists.`);
            }
          }
          console.log("✓ Users seeding completed.\n");
        }
      } catch (err) {
        console.log(
          "Error parsing mock-users.json, skipping user seeding:",
          err.message
        );
      }
    } else {
      console.log("mock-users.json not found, skipping user seeding.\n");
    }

    // ===== Seed Products from mock-products.json ===== //
    const mockProductsPath = path.join(__dirname, "..", "db", "mock-products.json");
    if (fs.existsSync(mockProductsPath)) {
      try {
        const fileContent = fs.readFileSync(mockProductsPath, "utf8").trim();
        if (!fileContent) {
          console.log("mock-products.json is empty, skipping product seeding.");
        } else {
          const mockProducts = JSON.parse(fileContent);
          console.log(`Found ${mockProducts.length} products in mock-products.json`);

          for (const productData of mockProducts) {
            const slug = (productData.product_name || "")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");

            // Check if product already exists
            const existingProduct = await Product.findOne({
              where: { product_slug: slug },
            });

            if (existingProduct) {
              console.log(`  - Product "${productData.product_name}" already exists, skipping.`);
              continue;
            }

            // Handle category
            let categoryId = null;
            if (productData.category_name) {
              let category = await ProductCategory.findOne({
                where: { category_name: productData.category_name },
              });

              if (!category) {
                const categorySlug = productData.category_name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");

                category = await ProductCategory.create({
                  category_name: productData.category_name,
                  category_slug: categorySlug,
                  is_active: true,
                });
                console.log(`  ✓ Category "${productData.category_name}" created.`);
              }
              categoryId = category.category_id;
            }

            // Create product
            const productId = uuidv4();
            await Product.create({
              product_id: productId,
              product_name: productData.product_name,
              product_description: productData.product_description || "",
              product_details: productData.product_details || null,
              product_slug: slug,
              category_id: categoryId,
              brand: productData.brand || "",
              price: productData.price || 0,
              sale_price: productData.sale_price || null,
              currency: "USD",
              sku: productData.sku || null,
              weight: productData.weight || null,
              dimensions: productData.dimensions || null,
              is_active: true,
              is_featured: productData.is_featured || false,
            });

            // Insert images
            if (productData.images && Array.isArray(productData.images)) {
              for (let i = 0; i < productData.images.length; i++) {
                await ProductImage.create({
                  product_id: productId,
                  image_url: productData.images[i],
                  is_primary: i === 0,
                  display_order: i,
                });
              }
            }

            // Insert tags
            if (productData.tags && Array.isArray(productData.tags)) {
              for (const tag of productData.tags) {
                await ProductTag.create({
                  product_id: productId,
                  tag_name: tag,
                });
              }
            }

            // Insert inventory
            const qty = productData.quantity_available || 0;
            await Inventory.create({
              product_id: productId,
              quantity_available: qty,
              quantity_reserved: 0,
              low_stock_threshold: 10,
              reorder_quantity: 50,
            });

            console.log(`  ✓ Product "${productData.product_name}" seeded with images, tags, and inventory.`);
          }
          console.log("✓ Products seeding completed.\n");
        }
      } catch (err) {
        console.log(
          "Error parsing mock-products.json, skipping product seeding:",
          err.message
        );
        console.error(err);
      }
    } else {
      console.log("mock-products.json not found, skipping product seeding.\n");
    }

    // ===== Seed Site Settings from sitesettings.json ===== //
    const siteSettingsPath = path.join(__dirname, "..", "db", "sitesettings.json");
    if (fs.existsSync(siteSettingsPath)) {
      try {
        const fileContent = fs.readFileSync(siteSettingsPath, "utf8").trim();
        if (!fileContent) {
          console.log("sitesettings.json is empty, skipping settings seeding.");
        } else {
          const settingsData = JSON.parse(fileContent);
          console.log(`Found ${settingsData.length} settings in sitesettings.json`);

          for (const setting of settingsData) {
            // Check if setting already exists
            const existing = await SiteSettings.findOne({
              where: { setting_key: setting.setting_key },
            });

            if (!existing) {
              await SiteSettings.create({
                setting_key: setting.setting_key,
                setting_value: setting.setting_value,
                setting_type: setting.setting_type || "string",
                setting_description: setting.setting_description || null,
                setting_category: setting.setting_category || "general",
              });
              console.log(`  ✓ Setting "${setting.setting_key}" seeded.`);
            } else {
              console.log(`  - Setting "${setting.setting_key}" already exists.`);
            }
          }
          console.log("✓ Site settings seeding completed.\n");
        }
      } catch (err) {
        console.log(
          "Error parsing sitesettings.json, skipping settings seeding:",
          err.message
        );
      }
    } else {
      console.log("sitesettings.json not found, seeding default settings...");
      
      // Seed default maintenance settings
      const defaultSettings = [
        {
          setting_key: "maintenance_mode",
          setting_value: "off",
          setting_type: "string",
          setting_description: "Site maintenance mode: off, site-wide, shop-only, registration-only",
          setting_category: "maintenance",
        },
        {
          setting_key: "maintenance_message",
          setting_value: "We are currently performing scheduled maintenance. Please check back soon.",
          setting_type: "string",
          setting_description: "Message displayed during maintenance",
          setting_category: "maintenance",
        },
        {
          setting_key: "default_currency",
          setting_value: "NZD",
          setting_type: "string",
          setting_description: "Default currency for the store",
          setting_category: "store",
        },
        {
          setting_key: "default_nationality",
          setting_value: "New Zealand",
          setting_type: "string",
          setting_description: "Default nationality for user registration",
          setting_category: "general",
        },
      ];

      for (const setting of defaultSettings) {
        const existing = await SiteSettings.findOne({
          where: { setting_key: setting.setting_key },
        });

        if (!existing) {
          await SiteSettings.create(setting);
          console.log(`  ✓ Default setting "${setting.setting_key}" seeded.`);
        } else {
          console.log(`  - Setting "${setting.setting_key}" already exists.`);
        }
      }
      console.log("✓ Default site settings seeding completed.\n");
    }

    // ===== Seed Freight Configuration ===== //
    console.log("Seeding freight configuration...");
    try {
      const existingFreight = await FreightConfig.findOne();
      
      if (!existingFreight) {
        await FreightConfig.create({
          local: 12.00,
          north_island: 12.60,        // 1.05 * 12
          south_island: 12.96,        // 1.08 * 12
          intl_asia: 13.80,           // 1.15 * 12
          intl_north_america: 15.00,  // 1.25 * 12
          intl_europe: 15.00,         // 1.25 * 12
          intl_africa: 15.00,         // 1.25 * 12
          intl_latin_america: 15.00,  // 1.25 * 12
          is_free_freight_enabled: false,
          threshold_local: 200.00,
          threshold_national: 300.00,
          threshold_international: 500.00,
        });
        console.log("  ✓ Freight configuration seeded with default values.");
      } else {
        console.log("  - Freight configuration already exists.");
      }
      console.log("✓ Freight configuration seeding completed.\n");
    } catch (err) {
      console.log("Error seeding freight configuration:", err.message);
    }

    // ===== Seed Sample Posts ===== //
    console.log("Seeding sample posts...");
    try {
      // Find an admin user to be the author
      const adminUser = await User.findOne({
        where: { user_role: "admin" },
      });

      if (!adminUser) {
        console.log("  - No admin user found, skipping post seeding.");
      } else {
        const samplePosts = [
          {
            post_title: "Welcome to Orbis History Maps",
            post_slug: "welcome-to-orbis-history-maps",
            post_content: `# Welcome to Orbis History Maps!

We are thrilled to launch our new platform dedicated to exploring the rich tapestry of world history through interactive maps.

## What You Can Expect

- **Interactive Maps**: Explore historical events across different time periods
- **Detailed Information**: Learn about civilizations, battles, and cultural movements
- **Educational Resources**: Access curated content for students and history enthusiasts

Stay tuned for more updates as we continue to expand our collection!`,
            post_excerpt: "Discover the launch of our new interactive history maps platform, bringing the past to life through modern technology.",
            post_status: "published",
            post_publish_date: new Date(),
            post_view_count: 42,
            seo_description: "Welcome to Orbis History Maps - your gateway to exploring world history through interactive maps and educational content.",
            seo_keywords: "history maps, world history, interactive maps, education",
            author_id: adminUser.user_id,
          },
          {
            post_title: "New Feature: Ancient Civilizations Timeline",
            post_slug: "new-feature-ancient-civilizations-timeline",
            post_content: `# Introducing Our Ancient Civilizations Timeline

We're excited to announce a brand new feature that allows you to explore the rise and fall of ancient civilizations!

## Featured Civilizations

1. **Ancient Egypt** - From the Old Kingdom to Cleopatra
2. **Mesopotamia** - The cradle of civilization
3. **Ancient Greece** - Democracy, philosophy, and the arts
4. **Roman Empire** - From republic to empire

## How to Use

Simply navigate to our timeline view and select your civilization of interest. You can zoom in and out to see different time scales.

This feature is the result of months of research and development, and we hope you find it as fascinating as we do!`,
            post_excerpt: "Explore our new timeline feature showcasing the rise and fall of ancient civilizations throughout history.",
            post_status: "published",
            post_publish_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            post_view_count: 128,
            seo_description: "Discover our new Ancient Civilizations Timeline feature - explore Egypt, Mesopotamia, Greece, and Rome.",
            seo_keywords: "ancient civilizations, history timeline, Egypt, Greece, Rome, Mesopotamia",
            author_id: adminUser.user_id,
          },
          {
            post_title: "Behind the Scenes: Building Historical Accuracy",
            post_slug: "behind-the-scenes-building-historical-accuracy",
            post_content: `# How We Ensure Historical Accuracy

At Orbis History Maps, we take historical accuracy seriously. Here's a look behind the scenes at our process.

## Our Research Process

- **Academic Sources**: We consult peer-reviewed historical journals
- **Expert Consultation**: Collaboration with university historians
- **Primary Sources**: Analysis of original documents and artifacts
- **Cross-referencing**: Multiple sources for every fact

## Continuous Improvement

History is always being reinterpreted as new discoveries are made. We commit to:

- Regular content reviews
- Updates based on new archaeological findings
- Community feedback integration

Thank you for trusting us with your historical education!`,
            post_excerpt: "Learn about our rigorous process for ensuring historical accuracy across all our interactive maps and content.",
            post_status: "published",
            post_publish_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            post_view_count: 85,
            seo_description: "Discover how Orbis History Maps ensures historical accuracy through rigorous research and expert consultation.",
            seo_keywords: "historical accuracy, research methodology, history education",
            author_id: adminUser.user_id,
          },
          {
            post_title: "Upcoming: Medieval Trade Routes Feature",
            post_slug: "upcoming-medieval-trade-routes-feature",
            post_content: `# Coming Soon: Medieval Trade Routes

We're working on an exciting new feature that will allow you to explore medieval trade networks!

## What to Expect

- **Silk Road**: Follow the ancient route from China to Europe
- **Hanseatic League**: Discover northern European maritime trade
- **Maritime Routes**: Explore Indian Ocean trade networks

## Expected Launch

We anticipate launching this feature in Q2 2024. Stay tuned for more details!`,
            post_excerpt: "Preview our upcoming Medieval Trade Routes feature - explore the Silk Road, Hanseatic League, and more.",
            post_status: "draft",
            post_publish_date: null,
            post_view_count: 0,
            seo_description: "Preview the upcoming Medieval Trade Routes feature on Orbis History Maps.",
            seo_keywords: "medieval trade, Silk Road, Hanseatic League, trade routes",
            author_id: adminUser.user_id,
          },
        ];

        for (const postData of samplePosts) {
          // Check if post already exists
          const existingPost = await Post.findOne({
            where: { post_slug: postData.post_slug },
          });

          if (!existingPost) {
            await Post.create(postData);
            console.log(`  ✓ Post "${postData.post_title}" seeded.`);
          } else {
            console.log(`  - Post "${postData.post_title}" already exists.`);
          }
        }
      }
      console.log("✓ Sample posts seeding completed.\n");
    } catch (err) {
      console.log("Error seeding posts:", err.message);
      console.error(err);
    }

    console.log("\n✓ Seeding completed successfully!");
  } catch (err) {
    console.error("\n❌ Seeding error:", err);
    hadError = true;
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
    process.exit(hadError ? 1 : 0);
  }
})();
