///////////////////////////////////////////////////////////////////////
// ======================= ORDER CONTROLLER ========================== //
///////////////////////////////////////////////////////////////////////

// This controller handles order-related HTTP requests

// ======= Module imports ======= //
const orderService = require("../services/orderService");

///////////////////////////////////////////////////////////////////////
// ======================= ORDER CONTROLLER ========================== //
///////////////////////////////////////////////////////////////////////

const orderController = {
  ///////////////////////////////////////////////////////////////////////
  // =================== GET USER ORDERS ============================= //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Get all orders for the authenticated user
   * GET /api/orders
   */
  getUserOrders: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const orders = await orderService.getUserOrders(userId, limit, offset);

      return res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      });
    } catch (error) {
      console.error("[orderController] Error getting user orders:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve orders",
        error: error.message,
      });
    }
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET ORDER DETAILS =========================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Get detailed order information
   * GET /api/orders/:orderId
   */
  getOrderDetails: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const { orderId } = req.params;

      const orderDetails = await orderService.getOrderDetails(orderId, userId);

      return res.status(200).json({
        success: true,
        message: "Order details retrieved successfully",
        data: orderDetails,
      });
    } catch (error) {
      console.error("[orderController] Error getting order details:", error);

      if (error.message === "Order not found") {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve order details",
        error: error.message,
      });
    }
  },

  ///////////////////////////////////////////////////////////////////////
  // ================== GET ORDER COUNT ============================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Get total order count for the authenticated user
   * GET /api/orders/count
   */
  getOrderCount: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const count = await orderService.getUserOrderCount(userId);

      return res.status(200).json({
        success: true,
        message: "Order count retrieved successfully",
        data: { count },
      });
    } catch (error) {
      console.error("[orderController] Error getting order count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve order count",
        error: error.message,
      });
    }
  },
};

module.exports = orderController;
