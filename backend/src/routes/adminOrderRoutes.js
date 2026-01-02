///////////////////////////////////////////////////////////////////////
// ===================== ADMIN ORDER ROUTES ======================== //
///////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");
const { requireAdmin } = require("../middleware/adminMiddleware");

// GET all orders (with optional filters)
router.get("/admin/orders", requireAdmin, adminOrderController.getAllOrders);

// GET order by id
router.get("/admin/orders/:orderId", requireAdmin, adminOrderController.getOrderById);

// PUT update order status
router.put("/admin/orders/:orderId/status", requireAdmin, adminOrderController.updateOrderStatus);

// PUT update payment status
router.put("/admin/orders/:orderId/payment", requireAdmin, adminOrderController.updatePaymentStatus);

// DELETE order
router.delete("/admin/orders/:orderId", requireAdmin, adminOrderController.deleteOrder);

module.exports = router;
