///////////////////////////////////////////////////////////////////////
// ========================= ORDER ROUTES ============================ //
///////////////////////////////////////////////////////////////////////

// This file defines routes for order operations

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller imports ======= //
const orderController = require("../controllers/orderController");

// ======= Middleware imports ======= //
const { requireAuth } = require("../middleware/authMiddleware");

///////////////////////////////////////////////////////////////////////
// ========================= ORDER ROUTES ============================ //
///////////////////////////////////////////////////////////////////////

// All order routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for the authenticated user
 * @access  Private
 */
router.get("/", orderController.getUserOrders);

/**
 * @route   GET /api/orders/count
 * @desc    Get order count for the authenticated user
 * @access  Private
 */
router.get("/count", orderController.getOrderCount);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get detailed order information
 * @access  Private
 */
router.get("/:orderId", orderController.getOrderDetails);

module.exports = router;
