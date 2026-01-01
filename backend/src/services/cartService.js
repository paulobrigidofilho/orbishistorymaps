///////////////////////////////////////////////////////////////////////
// ================ CART SERVICE (SEQUELIZE) ======================= //
///////////////////////////////////////////////////////////////////////

// This service handles shopping cart business logic using Sequelize ORM
// Provides cart management for users and guests

// ======= Module Imports ======= //
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const {
  Cart,
  CartItem,
  Product,
  ProductImage,
  Inventory,
  sequelize,
} = require("../models");

// ======= Constants Imports ======= //
const { CART_ERRORS } = require("../constants/errorMessages");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Get Or Create Cart ===== //
const getOrCreateCart = async (userId, sessionId) => {
  try {
    // Try to find existing cart
    const whereClause = userId
      ? { user_id: userId }
      : { session_id: sessionId };

    let cart = await Cart.findOne({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    if (cart) {
      return cart.get({ plain: true });
    }

    // Create new cart if none exists
    const cartId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    cart = await Cart.create({
      cart_id: cartId,
      user_id: userId,
      session_id: sessionId,
      expires_at: expiresAt,
    });

    return cart.get({ plain: true });
  } catch (error) {
    console.error("Error in getOrCreateCart:", error);
    throw error;
  }
};

// ===== Get Cart Items ===== //
const getCartItems = async (cartId) => {
  try {
    const items = await CartItem.findAll({
      where: { cart_id: cartId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "product_name",
            "product_slug",
            "price",
            "sale_price",
            "is_active",
          ],
          include: [
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
    });

    // Transform to match legacy format
    return items.map((item) => {
      const plainItem = item.get({ plain: true });
      return {
        cart_item_id: plainItem.cart_item_id,
        cart_id: plainItem.cart_id,
        product_id: plainItem.product_id,
        quantity: plainItem.quantity,
        price_at_addition: plainItem.price_at_addition,
        product_name: plainItem.product?.product_name,
        product_slug: plainItem.product?.product_slug,
        current_price: plainItem.product?.price,
        sale_price: plainItem.product?.sale_price,
        is_active: plainItem.product?.is_active,
        quantity_available: plainItem.product?.inventory?.quantity_available,
        primary_image: plainItem.product?.images?.[0]?.image_url || null,
      };
    });
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

// ===== Get Cart (Full) ===== //
const getCart = async (userId, sessionId) => {
  try {
    const cart = await getOrCreateCart(userId, sessionId);
    const items = await getCartItems(cart.cart_id);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const price = item.sale_price || item.current_price;
      return sum + parseFloat(price) * item.quantity;
    }, 0);

    return {
      cart_id: cart.cart_id,
      items,
      item_count: items.length,
      total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  } catch (error) {
    console.error("Error in getCart:", error);
    throw new Error(CART_ERRORS.FETCH_FAILED);
  }
};

// ===== Add To Cart ===== //
const addToCart = async (userId, sessionId, productId, quantity = 1) => {
  try {
    // Verify product exists and is available
    const product = await Product.findByPk(productId, {
      include: [{ model: Inventory, as: "inventory" }],
    });

    if (!product) {
      throw new Error(CART_ERRORS.PRODUCT_NOT_FOUND);
    }

    if (!product.is_active) {
      throw new Error(CART_ERRORS.PRODUCT_UNAVAILABLE);
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        product_id: productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      await existingItem.update({
        quantity: existingItem.quantity + quantity,
      });
    } else {
      // Insert new item
      await CartItem.create({
        cart_item_id: uuidv4(),
        cart_id: cart.cart_id,
        product_id: productId,
        quantity,
        price_at_addition: product.sale_price || product.price,
      });
    }

    return { message: "Product added to cart", cart_id: cart.cart_id };
  } catch (error) {
    console.error("Error in addToCart:", error);
    if (error.message === CART_ERRORS.PRODUCT_NOT_FOUND ||
        error.message === CART_ERRORS.PRODUCT_UNAVAILABLE) {
      throw error;
    }
    throw new Error(CART_ERRORS.ADD_FAILED);
  }
};

// ===== Update Cart Item ===== //
const updateCartItem = async (cartItemId, quantity) => {
  try {
    if (quantity < 1) {
      throw new Error(CART_ERRORS.INVALID_QUANTITY);
    }

    const [affectedRows] = await CartItem.update(
      { quantity },
      { where: { cart_item_id: cartItemId } }
    );

    if (affectedRows === 0) {
      throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
    }

    return { message: "Cart item updated" };
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    if (error.message === CART_ERRORS.INVALID_QUANTITY ||
        error.message === CART_ERRORS.ITEM_NOT_FOUND) {
      throw error;
    }
    throw new Error(CART_ERRORS.UPDATE_FAILED);
  }
};

// ===== Remove From Cart ===== //
const removeFromCart = async (cartItemId) => {
  try {
    const affectedRows = await CartItem.destroy({
      where: { cart_item_id: cartItemId },
    });

    if (affectedRows === 0) {
      throw new Error(CART_ERRORS.ITEM_NOT_FOUND);
    }

    return { message: "Item removed from cart" };
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    if (error.message === CART_ERRORS.ITEM_NOT_FOUND) {
      throw error;
    }
    throw new Error(CART_ERRORS.REMOVE_FAILED);
  }
};

// ===== Clear Cart ===== //
const clearCart = async (cartId) => {
  try {
    await CartItem.destroy({
      where: { cart_id: cartId },
    });

    return { message: "Cart cleared" };
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw new Error(CART_ERRORS.CLEAR_FAILED);
  }
};

// ===== Merge Guest Cart ===== //
const mergeGuestCart = async (sessionId, userId) => {
  try {
    await Cart.update(
      { user_id: userId, session_id: null },
      {
        where: {
          session_id: sessionId,
          user_id: null,
        },
      }
    );

    return { message: "Cart merged successfully" };
  } catch (error) {
    console.error("Error in mergeGuestCart:", error);
    throw new Error(CART_ERRORS.MERGE_FAILED);
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getOrCreateCart,
  getCartItems,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
};
