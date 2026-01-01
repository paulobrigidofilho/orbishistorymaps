///////////////////////////////////////////////////////////////////////
// ================ ADMIN ORDER SERVICE (SEQUELIZE) ================ //
///////////////////////////////////////////////////////////////////////

// This service handles admin order-related business logic

// ======= Module Imports ======= //
const { Op } = require("sequelize");
const { sequelize } = require("../config/sequelizeConfig");

// ======= Model Imports ======= //
const { Order, OrderItem, Product, ProductImage, User, Address } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

const adminOrderService = {
  // Get all orders (optionally filtered by status, user, etc)
  getAllOrders: async (filters = {}, limit = 50, offset = 0) => {
    const whereConditions = {};

    if (filters.status) {
      whereConditions.order_status = filters.status;
    }
    if (filters.userId) {
      whereConditions.user_id = filters.userId;
    }

    const orders = await Order.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "user_email", "user_firstname", "user_lastname"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: limit,
      offset: offset,
    });

    return orders.map((order) => order.toJSON());
  },

  // Get order details by id (admin, no user restriction)
  getOrderById: async (orderId) => {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "user_email", "user_firstname", "user_lastname"],
        },
        {
          model: Address,
          as: "shippingAddress",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "product_name", "product_slug"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  where: { is_primary: true },
                  required: false,
                  attributes: ["image_url"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order.toJSON();
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const [updated] = await Order.update(
      { order_status: status },
      { where: { order_id: orderId } }
    );

    if (updated === 0) {
      throw new Error("Order not found");
    }

    return { orderId, status, updated: true };
  },

  // Update payment status
  updatePaymentStatus: async (orderId, status) => {
    const [updated] = await Order.update(
      { payment_status: status },
      { where: { order_id: orderId } }
    );

    if (updated === 0) {
      throw new Error("Order not found");
    }

    return { orderId, paymentStatus: status, updated: true };
  },

  // Delete order
  deleteOrder: async (orderId) => {
    const transaction = await sequelize.transaction();

    try {
      // Delete order items first
      await OrderItem.destroy({
        where: { order_id: orderId },
        transaction,
      });

      // Delete the order
      const deleted = await Order.destroy({
        where: { order_id: orderId },
        transaction,
      });

      if (deleted === 0) {
        throw new Error("Order not found");
      }

      await transaction.commit();
      return { orderId, deleted: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = adminOrderService;
