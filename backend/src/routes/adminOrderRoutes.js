///////////////////////////////////////////////////////////////////////
// ===================== ADMIN ORDER ROUTES ======================== //
///////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");
const { requireAdmin } = require("../middleware/adminMiddleware");

// All admin order routes require admin
router.use(requireAdmin);

// GET all orders (with optional filters)
router.get("/admin/orders", adminOrderController.getAllOrders);

// GET order by id
router.get("/admin/orders/:orderId", adminOrderController.getOrderById);

// PUT update order status
router.put("/admin/orders/:orderId/status", adminOrderController.updateOrderStatus);

// PUT update payment status
router.put("/admin/orders/:orderId/payment", adminOrderController.updatePaymentStatus);

// DELETE order
router.delete("/admin/orders/:orderId", adminOrderController.deleteOrder);

module.exports = router;
