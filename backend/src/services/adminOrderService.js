///////////////////////////////////////////////////////////////////////
// ===================== ADMIN ORDER SERVICE ======================== //
///////////////////////////////////////////////////////////////////////

// This service handles admin order-related business logic
const orderModel = require("../model/orderModel");

const adminOrderService = {
	// Get all orders (optionally filtered by status, user, etc)
	getAllOrders: (filters = {}, limit = 50, offset = 0) => {
		return new Promise((resolve, reject) => {
			let query = `SELECT * FROM orders`;
			const where = [];
			const params = [];
			if (filters.status) {
				where.push("order_status = ?");
				params.push(filters.status);
			}
			if (filters.userId) {
				where.push("user_id = ?");
				params.push(filters.userId);
			}
			if (where.length) {
				query += " WHERE " + where.join(" AND ");
			}
			query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
			params.push(limit, offset);
			orderModel.db.query(query, params, (err, results) => {
				if (err) return reject(err);
				resolve(results);
			});
		});
	},

	// Get order details by id (admin, no user restriction)
	getOrderById: (orderId) => {
		return new Promise((resolve, reject) => {
			orderModel.getOrderById(orderId, null, (err, order) => {
				if (err) return reject(err);
				if (!order) return reject(new Error("Order not found"));
				orderModel.getOrderItems(orderId, (itemErr, items) => {
					if (itemErr) return reject(itemErr);
					resolve({ ...order, items: items || [] });
				});
			});
		});
	},

	// Update order status
	updateOrderStatus: (orderId, status) => {
		return new Promise((resolve, reject) => {
			orderModel.updateOrderStatus(orderId, status, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	},

	// Update payment status
	updatePaymentStatus: (orderId, status) => {
		return new Promise((resolve, reject) => {
			orderModel.updatePaymentStatus(orderId, status, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	},

	// Delete order
	deleteOrder: (orderId) => {
		return new Promise((resolve, reject) => {
			// Delete order items first
			orderModel.db.query("DELETE FROM order_items WHERE order_id = ?", [orderId], (err) => {
				if (err) return reject(err);
				orderModel.db.query("DELETE FROM orders WHERE order_id = ?", [orderId], (err2, result) => {
					if (err2) return reject(err2);
					resolve(result);
				});
			});
		});
	},
};

module.exports = adminOrderService;
