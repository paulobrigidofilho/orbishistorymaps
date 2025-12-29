///////////////////////////////////////////////////////////////////////
// ======================== ORDER SERVICE ============================ //
///////////////////////////////////////////////////////////////////////

// This service handles order-related business logic

// ======= Module imports ======= //
const orderModel = require("../model/orderModel");

///////////////////////////////////////////////////////////////////////
// ========================= ORDER SERVICE =========================== //
///////////////////////////////////////////////////////////////////////

const orderService = {
  ///////////////////////////////////////////////////////////////////////
  // =================== GET USER ORDERS ============================= //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets orders for a specific user
   * @param {string} userId - The user's UUID
   * @param {number} limit - Maximum orders to return
   * @param {number} offset - Number of orders to skip
   * @returns {Promise<Object>} User's orders
   */
  getUserOrders: (userId, limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
      orderModel.getUserOrders(userId, limit, offset, (err, orders) => {
        if (err) {
          return reject(err);
        }
        return resolve(orders || []);
      });
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET ORDER DETAILS =========================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets detailed order information including items
   * @param {string} orderId - The order's UUID
   * @param {string} userId - The user's UUID (for authorization)
   * @returns {Promise<Object>} Order details with items
   */
  getOrderDetails: (orderId, userId) => {
    return new Promise((resolve, reject) => {
      orderModel.getOrderById(orderId, userId, (err, order) => {
        if (err) {
          return reject(err);
        }

        if (!order) {
          return reject(new Error("Order not found"));
        }

        // Get order items
        orderModel.getOrderItems(orderId, (itemErr, items) => {
          if (itemErr) {
            return reject(itemErr);
          }

          return resolve({
            ...order,
            items: items || [],
          });
        });
      });
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ================== GET ORDER COUNT ============================== //
  ///////////////////////////////////////////////////////////////////////

  /**
   * Gets total order count for a user
   * @param {string} userId - The user's UUID
   * @returns {Promise<number>} Total order count
   */
  getUserOrderCount: (userId) => {
    return new Promise((resolve, reject) => {
      orderModel.getUserOrders(userId, 999999, 0, (err, orders) => {
        if (err) {
          return reject(err);
        }
        return resolve(orders?.length || 0);
      });
    });
  },
};

module.exports = orderService;
