//////////////////////////////////////////////////
// ========= CART CONTROLLER ================== //
//////////////////////////////////////////////////

// This controller handles shopping cart HTTP requests

// ======= Module imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { CART_ERRORS } = require("../constants/errorMessages");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../services/cartService");

// ====== Get Cart Function ====== //

const getUserCart = async (req, res) => {
  console.log("Get cart request received");

  try {
    const userId = req.session?.user?.id || null;
    const sessionId = req.sessionID;

    const cart = await getCart(userId, sessionId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return handleServerError(res, error, "getCart");
  }
};

// ====== Add to Cart Function ====== //

const addItemToCart = async (req, res) => {
  console.log("Add to cart request received");

  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const userId = req.session?.user?.id || null;
    const sessionId = req.sessionID;

    const result = await addToCart(userId, sessionId, productId, quantity);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { cart_id: result.cart_id },
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    if (
      error.message === CART_ERRORS.PRODUCT_NOT_FOUND ||
      error.message === CART_ERRORS.PRODUCT_UNAVAILABLE
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "addToCart");
  }
};

// ====== Update Cart Item Function ====== //

const updateItem = async (req, res) => {
  console.log("Update cart item request received");

  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: CART_ERRORS.INVALID_QUANTITY,
      });
    }

    const result = await updateCartItem(cartItemId, quantity);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    if (error.message === CART_ERRORS.ITEM_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "updateCartItem");
  }
};

// ====== Remove from Cart Function ====== //

const removeItem = async (req, res) => {
  console.log("Remove from cart request received");

  try {
    const { cartItemId } = req.params;

    const result = await removeFromCart(cartItemId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    if (error.message === CART_ERRORS.ITEM_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "removeFromCart");
  }
};

// ====== Clear Cart Function ====== //

const clearUserCart = async (req, res) => {
  console.log("Clear cart request received");

  try {
    const { cartId } = req.params;

    const result = await clearCart(cartId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return handleServerError(res, error, "clearCart");
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  updateItem,
  removeItem,
  clearUserCart,
};
