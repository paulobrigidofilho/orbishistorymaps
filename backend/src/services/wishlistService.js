///////////////////////////////////////////////////////////////////////
// ================ WISHLIST SERVICE (SEQUELIZE) =================== //
///////////////////////////////////////////////////////////////////////

// This service handles wishlist business logic using Sequelize ORM
// Provides wishlist management for users

// ======= Module Imports ======= //
const { v4: uuidv4 } = require("uuid");

// ======= Model Imports ======= //
const {
  Wishlist,
  Product,
  ProductCategory,
  ProductImage,
  Inventory,
} = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Get User Wishlist ===== //
const getUserWishlist = async (userId) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "product_id",
            "product_name",
            "product_slug",
            "price",
            "sale_price",
            "is_active",
          ],
          include: [
            {
              model: ProductCategory,
              as: "category",
              attributes: ["category_name"],
            },
            {
              model: ProductImage,
              as: "images",
              where: { is_primary: true },
              required: false,
              attributes: ["image_url"],
            },
            {
              model: Inventory,
              as: "inventory",
              attributes: ["quantity_available"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Transform to match legacy format
    return wishlistItems.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        wishlist_id: plainItem.wishlist_id,
        user_id: plainItem.user_id,
        product_id: plainItem.product_id,
        created_at: plainItem.created_at,
        product_name: plainItem.product?.product_name,
        product_slug: plainItem.product?.product_slug,
        price: plainItem.product?.price,
        sale_price: plainItem.product?.sale_price,
        is_active: plainItem.product?.is_active,
        category_name: plainItem.product?.category?.category_name,
        primary_image: plainItem.product?.images?.[0]?.image_url || null,
        quantity_available: plainItem.product?.inventory?.quantity_available,
      };
    });
  } catch (error) {
    console.error("Error in getUserWishlist:", error);
    throw error;
  }
};

// ===== Add To Wishlist ===== //
const addToWishlist = async (userId, productId) => {
  try {
    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      return { message: "Product already in wishlist", exists: true };
    }

    await Wishlist.create({
      wishlist_id: uuidv4(),
      user_id: userId,
      product_id: productId,
    });

    return { message: "Product added to wishlist", created: true };
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    throw error;
  }
};

// ===== Remove From Wishlist ===== //
const removeFromWishlist = async (userId, productId) => {
  try {
    const affectedRows = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId },
    });

    return { affectedRows, message: "Product removed from wishlist" };
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    throw error;
  }
};

// ===== Is In Wishlist ===== //
const isInWishlist = async (userId, productId) => {
  try {
    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    return !!item;
  } catch (error) {
    console.error("Error in isInWishlist:", error);
    throw error;
  }
};

// ===== Get Wishlist Count ===== //
const getWishlistCount = async (userId) => {
  try {
    const count = await Wishlist.count({
      where: { user_id: userId },
    });

    return count;
  } catch (error) {
    console.error("Error in getWishlistCount:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlistCount,
};
