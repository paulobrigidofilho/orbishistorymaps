///////////////////////////////////////////////////////////////////////
// ==================== ORDER CONFIRMATION PAGE ====================== //
///////////////////////////////////////////////////////////////////////

// This page displays order confirmation after successful checkout

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderConfirmation.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";

//  ========== Function imports  ========== //
import getOrderById from "./functions/orderService/getOrderById";

///////////////////////////////////////////////////////////////////////
// ==================== ORDER CONFIRMATION =========================== //
///////////////////////////////////////////////////////////////////////

export default function OrderConfirmation() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Load order details
  useEffect(() => {
    const orderId = sessionStorage.getItem("lastOrderId");

    if (!orderId) {
      setError("Order not found");
      setLoading(false);
      return;
    }

    fetchOrder(orderId);

    // Clear the order ID from session storage after loading
    return () => {
      sessionStorage.removeItem("lastOrderId");
    };
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch order details
  const fetchOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.confirmationPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error || !order) {
    return (
      <div className={styles.confirmationPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#e74c3c" }}>
            error_outline
          </i>
          <h2>Order Not Found</h2>
          <p>{error || "We couldn't find your order details."}</p>
          <button onClick={() => navigate("/shop")} className={styles.shopButton}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.confirmationPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Confirmation Container */}
      <div className={styles.confirmationContainer}>
        {/* Success Header */}
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>
            <i className="material-icons">check_circle</i>
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className={styles.orderCard}>
          {/* Order Info */}
          <div className={styles.orderInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Order Number:</span>
              <span className={styles.infoValue}>#{order.order_number}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Order Date:</span>
              <span className={styles.infoValue}>{formatDate(order.created_at)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={`${styles.statusBadge} ${styles[order.order_status]}`}>
                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className={styles.section}>
            <h2>Shipping Address</h2>
            <div className={styles.addressDisplay}>
              <p>{order.shipping_street_address}</p>
              <p>
                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className={styles.section}>
            <h2>Order Items</h2>
            <div className={styles.itemsList}>
              {order.items?.map((item) => (
                <div key={item.order_item_id} className={styles.orderItem}>
                  {item.primary_image && (
                    <img
                      src={item.primary_image}
                      alt={item.product_name}
                      className={styles.itemImage}
                    />
                  )}
                  <div className={styles.itemDetails}>
                    <h3>{item.product_name}</h3>
                    <p className={styles.itemMeta}>
                      Quantity: {item.quantity} × ${parseFloat(item.price_at_purchase).toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.itemPrice}>
                    ${(item.quantity * parseFloat(item.price_at_purchase)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${parseFloat(order.subtotal_amount).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>
                {parseFloat(order.shipping_cost) === 0
                  ? "FREE"
                  : `$${parseFloat(order.shipping_cost).toFixed(2)}`}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${parseFloat(order.tax_amount || 0).toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className={styles.paymentInfo}>
            <p>
              <strong>Payment Method:</strong>{" "}
              {order.payment_method
                ? order.payment_method.replace("_", " ").toUpperCase()
                : "N/A"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button onClick={() => navigate("/shop")} className={styles.shopButton}>
              Continue Shopping
            </button>
            <button
              onClick={() => navigate(`/profile/${order.user_id}`)}
              className={styles.ordersButton}
            >
              View All Orders
            </button>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className={styles.confirmationMessage}>
          <p>
            A confirmation email has been sent to your registered email address. You can track your
            order status in your profile.
          </p>
        </div>
      </div>
    </div>
  );
}
