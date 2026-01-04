///////////////////////////////////////////////////////////////////////
// ================ ORDER SERVICE (SEQUELIZE) ====================== //
///////////////////////////////////////////////////////////////////////

// This service handles order-related business logic using Sequelize ORM
// Provides order management and checkout operations

// ======= Module Imports ======= //
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const {
  Order,
  OrderItem,
  Product,
  ProductImage,
  Address,
  User,
  Cart,
  CartItem,
  Inventory,
  Payment,
  sequelize,
} = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Get User Orders ===== //
const getUserOrders = async (userId, limit = 10, offset = 0) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_slug"],
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
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return orders.map((order) => {
      const plainOrder = order.get({ plain: true });
      return {
        ...plainOrder,
        items: plainOrder.items?.map((item) => ({
          ...item,
          product_slug: item.product?.product_slug,
          primary_image: item.product?.images?.[0]?.image_url || null,
          product: undefined,
        })),
      };
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    throw error;
  }
};

// ===== Get Order Details ===== //
const getOrderDetails = async (orderId, userId) => {
  try {
    const order = await Order.findOne({
      where: { order_id: orderId, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_slug"],
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
        {
          model: Address,
          as: "shippingAddress",
        },
        {
          model: Address,
          as: "billingAddress",
        },
        {
          model: Payment,
          as: "payments",
        },
      ],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const plainOrder = order.get({ plain: true });
    return {
      ...plainOrder,
      items: plainOrder.items?.map((item) => ({
        ...item,
        product_slug: item.product?.product_slug,
        primary_image: item.product?.images?.[0]?.image_url || null,
        product: undefined,
      })),
      shipping_address: plainOrder.shippingAddress,
      billing_address: plainOrder.billingAddress,
    };
  } catch (error) {
    console.error("Error in getOrderDetails:", error);
    throw error;
  }
};

// ===== Get Order By ID (Admin) ===== //
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "user_firstname", "user_lastname", "user_email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product", attributes: ["product_name", "product_slug"] }],
        },
        { model: Address, as: "shippingAddress" },
        { model: Address, as: "billingAddress" },
        { model: Payment, as: "payments" },
      ],
    });

    return order ? order.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};

// ===== Get User Order Count ===== //
const getUserOrderCount = async (userId) => {
  try {
    const count = await Order.count({
      where: { user_id: userId },
    });
    return count;
  } catch (error) {
    console.error("Error in getUserOrderCount:", error);
    throw error;
  }
};

// ===== Create Order ===== //
const createOrder = async (userId, orderData) => {
  const transaction = await sequelize.transaction();

  try {
    const orderId = uuidv4();
    const orderNumber = `ORB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order
    const order = await Order.create(
      {
        order_id: orderId,
        user_id: userId,
        order_number: orderNumber,
        order_status: "pending",
        payment_status: "pending",
        payment_method: orderData.payment_method,
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax_amount || 0,
        shipping_cost: orderData.shipping_cost || 0,
        discount_amount: orderData.discount_amount || 0,
        total_amount: orderData.total_amount,
        shipping_address_id: orderData.shipping_address_id,
        billing_address_id: orderData.billing_address_id,
        notes: orderData.notes,
      },
      { transaction }
    );

    // Create order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item) => ({
        order_item_id: uuidv4(),
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
      }));

      await OrderItem.bulkCreate(orderItems, { transaction });

      // Update inventory
      for (const item of orderData.items) {
        await Inventory.decrement("quantity_available", {
          by: item.quantity,
          where: { product_id: item.product_id },
          transaction,
        });
      }
    }

    // Clear user's cart
    const cart = await Cart.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (cart) {
      await CartItem.destroy({
        where: { cart_id: cart.cart_id },
        transaction,
      });
    }

    await transaction.commit();

    return {
      order_id: orderId,
      order_number: orderNumber,
      message: "Order created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createOrder:", error);
    throw error;
  }
};

// ===== Update Order Status ===== //
const updateOrderStatus = async (orderId, status) => {
  try {
    const [affectedRows] = await Order.update(
      { order_status: status },
      { where: { order_id: orderId } }
    );
    return { affectedRows };
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};

// ===== Update Payment Status ===== //
const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const [affectedRows] = await Order.update(
      { payment_status: paymentStatus },
      { where: { order_id: orderId } }
    );
    return { affectedRows };
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getUserOrders,
  getOrderDetails,
  getOrderById,
  getUserOrderCount,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
};
