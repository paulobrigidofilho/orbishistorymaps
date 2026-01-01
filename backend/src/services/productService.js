///////////////////////////////////////////////////////////////////////
// ================ PRODUCT SERVICE (SEQUELIZE) ==================== //
///////////////////////////////////////////////////////////////////////

// This service handles product-related business logic using Sequelize ORM
// Provides product catalog management and queries

// ======= Module Imports ======= //
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const {
  Product,
  ProductCategory,
  ProductImage,
  ProductTag,
  Inventory,
  sequelize,
} = require("../models");

// ======= Constants Imports ======= //
const { PRODUCT_ERRORS } = require("../constants/errorMessages");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Get All Products ===== //
const getAllProducts = async (filters = {}) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      limit = 50,
      offset = 0,
    } = filters;

    const where = { is_active: true };

    if (category) {
      where.category_id = category;
    }

    if (minPrice) {
      where.price = { ...where.price, [Op.gte]: minPrice };
    }

    if (maxPrice) {
      where.price = { ...where.price, [Op.lte]: maxPrice };
    }

    if (search) {
      where[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { product_description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
      ];
    }

    if (featured) {
      where.is_featured = true;
    }

    const products = await Product.findAll({
      where,
      attributes: [
        "product_id",
        "product_name",
        "product_description",
        "product_slug",
        "category_id",
        "brand",
        "price",
        "sale_price",
        "currency",
        "sku",
        "is_active",
        "is_featured",
        "rating_average",
        "rating_count",
        "created_at",
      ],
      include: [
        {
          model: ProductCategory,
          as: "category",
          attributes: ["category_name"],
        },
        {
          model: Inventory,
          as: "inventory",
          attributes: ["quantity_available"],
        },
        {
          model: ProductImage,
          as: "images",
          where: { is_primary: true },
          required: false,
          attributes: ["image_url"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Transform to match legacy format
    return products.map((p) => {
      const product = p.get({ plain: true });
      return {
        ...product,
        category_name: product.category?.category_name,
        quantity_available: product.inventory?.quantity_available,
        primary_image: product.images?.[0]?.image_url || null,
        // Clean up nested objects
        category: undefined,
        inventory: undefined,
        images: undefined,
      };
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw new Error(PRODUCT_ERRORS.FETCH_FAILED);
  }
};

// ===== Get Product Details ===== //
const getProductDetails = async (identifier) => {
  try {
    // Determine if identifier is UUID or slug
    const isUuid = identifier.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    const where = isUuid
      ? { product_id: identifier, is_active: true }
      : { product_slug: identifier, is_active: true };

    const product = await Product.findOne({
      where,
      include: [
        {
          model: ProductCategory,
          as: "category",
          attributes: ["category_name", "category_slug"],
        },
        {
          model: Inventory,
          as: "inventory",
          attributes: ["quantity_available", "quantity_reserved"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["image_id", "image_url", "image_alt_text", "is_primary", "display_order"],
        },
        {
          model: ProductTag,
          as: "tags",
          attributes: ["tag_id", "tag_name"],
        },
      ],
    });

    if (!product) {
      throw new Error(PRODUCT_ERRORS.NOT_FOUND);
    }

    // Increment view count (don't wait for it)
    Product.increment("view_count", { where: { product_id: product.product_id } }).catch(
      console.error
    );

    // Transform to match legacy format
    const plainProduct = product.get({ plain: true });
    return {
      ...plainProduct,
      category_name: plainProduct.category?.category_name,
      category_slug: plainProduct.category?.category_slug,
      quantity_available: plainProduct.inventory?.quantity_available,
      quantity_reserved: plainProduct.inventory?.quantity_reserved,
      images: plainProduct.images || [],
      tags: plainProduct.tags?.map((t) => t.tag_name) || [],
      // Clean up nested objects
      category: undefined,
      inventory: undefined,
    };
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    if (error.message === PRODUCT_ERRORS.NOT_FOUND) {
      throw error;
    }
    throw new Error(PRODUCT_ERRORS.FETCH_FAILED);
  }
};

// ===== Create Product ===== //
const createProduct = async (productData) => {
  const transaction = await sequelize.transaction();

  try {
    const productId = uuidv4();
    const productSlug =
      productData.product_slug ||
      productData.product_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const product = await Product.create(
      {
        product_id: productId,
        product_name: productData.product_name,
        product_description: productData.product_description,
        product_details: productData.product_details,
        product_slug: productSlug,
        category_id: productData.category_id,
        brand: productData.brand,
        price: productData.price,
        sale_price: productData.sale_price,
        currency: productData.currency || "USD",
        sku: productData.sku,
        weight: productData.weight,
        dimensions: productData.dimensions,
        is_active: productData.is_active ?? true,
        is_featured: productData.is_featured ?? false,
      },
      { transaction }
    );

    // Create inventory record
    await Inventory.create(
      {
        product_id: productId,
        quantity_available: productData.quantity_available || 0,
      },
      { transaction }
    );

    await transaction.commit();
    return { product_id: productId };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createProduct:", error);
    throw new Error(PRODUCT_ERRORS.CREATE_FAILED);
  }
};

// ===== Update Product ===== //
const updateProduct = async (productId, productData) => {
  try {
    // Filter out undefined values
    const updateData = {};
    const allowedFields = [
      "product_name",
      "product_description",
      "product_details",
      "product_slug",
      "category_id",
      "brand",
      "price",
      "sale_price",
      "currency",
      "sku",
      "weight",
      "dimensions",
      "is_active",
      "is_featured",
    ];

    allowedFields.forEach((field) => {
      if (productData[field] !== undefined) {
        updateData[field] = productData[field];
      }
    });

    const [affectedRows] = await Product.update(updateData, {
      where: { product_id: productId },
    });

    if (affectedRows === 0) {
      throw new Error(PRODUCT_ERRORS.NOT_FOUND);
    }

    // Update inventory if quantity provided
    if (productData.quantity_available !== undefined) {
      await Inventory.update(
        { quantity_available: productData.quantity_available },
        { where: { product_id: productId } }
      );
    }

    return { message: "Product updated successfully" };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    if (error.message === PRODUCT_ERRORS.NOT_FOUND) {
      throw error;
    }
    throw new Error(PRODUCT_ERRORS.UPDATE_FAILED);
  }
};

// ===== Delete Product ===== //
const deleteProduct = async (productId) => {
  try {
    const affectedRows = await Product.destroy({
      where: { product_id: productId },
    });

    if (affectedRows === 0) {
      throw new Error(PRODUCT_ERRORS.NOT_FOUND);
    }

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    if (error.message === PRODUCT_ERRORS.NOT_FOUND) {
      throw error;
    }
    throw new Error(PRODUCT_ERRORS.DELETE_FAILED);
  }
};

// ===== Get Product Categories ===== //
const getCategories = async () => {
  try {
    const categories = await ProductCategory.findAll({
      where: { is_active: true },
      attributes: ["category_id", "category_name", "category_slug", "category_description"],
      order: [["category_name", "ASC"]],
    });

    return categories.map((c) => c.get({ plain: true }));
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
