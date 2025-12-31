///////////////////////////////////////////////////////////////////////
// ===================== ADMIN ORDER CONTROLLER ==================== //
///////////////////////////////////////////////////////////////////////

const adminOrderService = require("../services/adminOrderService");

const adminOrderController = {
	// GET /api/admin/orders
	getAllOrders: async (req, res) => {
		try {
			const { status, userId, limit = 50, offset = 0 } = req.query;
			const filters = {};
			if (status) filters.status = status;
			if (userId) filters.userId = userId;
			const orders = await adminOrderService.getAllOrders(filters, parseInt(limit), parseInt(offset));
			res.status(200).json({ success: true, data: orders });
		} catch (error) {
			res.status(500).json({ success: false, message: "Failed to get orders", error: error.message });
		}
	},

	// GET /api/admin/orders/:orderId
	getOrderById: async (req, res) => {
		try {
			const { orderId } = req.params;
			const order = await adminOrderService.getOrderById(orderId);
			res.status(200).json({ success: true, data: order });
		} catch (error) {
			res.status(404).json({ success: false, message: error.message });
		}
	},

	// PUT /api/admin/orders/:orderId/status
	updateOrderStatus: async (req, res) => {
		try {
			const { orderId } = req.params;
			const { status } = req.body;
			await adminOrderService.updateOrderStatus(orderId, status);
			res.status(200).json({ success: true, message: "Order status updated" });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},

	// PUT /api/admin/orders/:orderId/payment
	updatePaymentStatus: async (req, res) => {
		try {
			const { orderId } = req.params;
			const { status } = req.body;
			await adminOrderService.updatePaymentStatus(orderId, status);
			res.status(200).json({ success: true, message: "Payment status updated" });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},

	// DELETE /api/admin/orders/:orderId
	deleteOrder: async (req, res) => {
		try {
			const { orderId } = req.params;
			await adminOrderService.deleteOrder(orderId);
			res.status(200).json({ success: true, message: "Order deleted" });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
};

module.exports = adminOrderController;
