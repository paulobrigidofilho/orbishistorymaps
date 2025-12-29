// ======= Module imports ======= //
const db = require("../config/config").db;

///////////////////////////////////////////////////////////////////////
// ========================= ORDER MODEL =========================== //
///////////////////////////////////////////////////////////////////////

const orderModel = {
  ///////////////////////////////////////////////////////////////////////
  // ===================== CREATE ORDER ============================== //
  ///////////////////////////////////////////////////////////////////////

  createOrder: (orderData, callback) => {
    const query = `
      INSERT INTO orders (
        order_id, user_id, order_number, order_status, payment_status, payment_method,
        subtotal, tax_amount, shipping_cost, discount_amount, total_amount, currency,
        shipping_address_id, billing_address_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        orderData.order_id,
        orderData.user_id,
        orderData.order_number,
        orderData.order_status,
        orderData.payment_status,
        orderData.payment_method,
        orderData.subtotal,
        orderData.tax_amount,
        orderData.shipping_cost,
        orderData.discount_amount,
        orderData.total_amount,
        orderData.currency,
        orderData.shipping_address_id,
        orderData.billing_address_id,
        orderData.notes,
      ],
      (err, result) => {
        if (err) {
          console.error("Database INSERT error:", err);
          return callback(err, null);
        }
        console.log("Order created successfully");
        return callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // ===================== CREATE ORDER ITEMS ======================== //
  ///////////////////////////////////////////////////////////////////////

  createOrderItems: (orderItems, callback) => {
    const query = `
      INSERT INTO order_items (
        order_item_id, order_id, product_id, product_name, product_sku,
        quantity, unit_price, subtotal
      ) VALUES ?`;

    const values = orderItems.map((item) => [
      item.order_item_id,
      item.order_id,
      item.product_id,
      item.product_name,
      item.product_sku,
      item.quantity,
      item.unit_price,
      item.subtotal,
    ]);

    db.query(query, [values], (err, result) => {
      if (err) {
        console.error("Database INSERT error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET ORDER BY ID ============================ //
  ///////////////////////////////////////////////////////////////////////

  getOrderById: (orderId, userId, callback) => {
    const query = `
      SELECT o.*, 
        sa.recipient_name as shipping_recipient, sa.address_line_1 as shipping_address_1,
        sa.address_line_2 as shipping_address_2, sa.city as shipping_city,
        sa.state as shipping_state, sa.postal_code as shipping_postal_code,
        sa.country as shipping_country, sa.phone_number as shipping_phone,
        ba.recipient_name as billing_recipient, ba.address_line_1 as billing_address_1,
        ba.address_line_2 as billing_address_2, ba.city as billing_city,
        ba.state as billing_state, ba.postal_code as billing_postal_code,
        ba.country as billing_country
      FROM orders o
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.address_id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.address_id
      WHERE o.order_id = ? AND o.user_id = ?`;

    db.query(query, [orderId, userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results[0] || null);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET ORDER ITEMS ============================ //
  ///////////////////////////////////////////////////////////////////////

  getOrderItems: (orderId, callback) => {
    const query = `
      SELECT * FROM order_items 
      WHERE order_id = ?
      ORDER BY created_at ASC`;

    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GET USER ORDERS ============================ //
  ///////////////////////////////////////////////////////////////////////

  getUserOrders: (userId, limit = 10, offset = 0, callback) => {
    const query = `
      SELECT order_id, order_number, order_status, payment_status, total_amount, currency, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`;

    db.query(query, [userId, limit, offset], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== UPDATE ORDER STATUS ======================== //
  ///////////////////////////////////////////////////////////////////////

  updateOrderStatus: (orderId, status, callback) => {
    const query = `
      UPDATE orders 
      SET order_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ?`;

    db.query(query, [status, orderId], (err, result) => {
      if (err) {
        console.error("Database UPDATE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ================== UPDATE PAYMENT STATUS ======================== //
  ///////////////////////////////////////////////////////////////////////

  updatePaymentStatus: (orderId, status, callback) => {
    const query = `
      UPDATE orders 
      SET payment_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ?`;

    db.query(query, [status, orderId], (err, result) => {
      if (err) {
        console.error("Database UPDATE error:", err);
        return callback(err, null);
      }
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ==================== GENERATE ORDER NUMBER ====================== //
  ///////////////////////////////////////////////////////////////////////

  generateOrderNumber: (callback) => {
    const prefix = "ORB";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const orderNumber = `${prefix}-${timestamp}-${random}`;
    
    callback(null, orderNumber);
  },
};

module.exports = orderModel;
