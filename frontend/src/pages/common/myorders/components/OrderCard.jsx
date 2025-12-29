///////////////////////////////////////////////////////////////////////
// ====================== ORDER CARD COMPONENT ======================= //
///////////////////////////////////////////////////////////////////////

// This component displays a single order in the orders list

//  ========== Module imports  ========== //
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderCard.module.css";

//  ========== Constants imports  ========== //
import { ORDER_STATUS, PAYMENT_STATUS } from "../constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// ========================= ORDER CARD ============================== //
///////////////////////////////////////////////////////////////////////

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status styling
  const getStatusStyle = (status, statusMap) => {
    const statusInfo = statusMap[status] || { label: status, color: "#95a5a6" };
    return statusInfo;
  };

  const orderStatus = getStatusStyle(order.order_status, ORDER_STATUS);
  const paymentStatus = getStatusStyle(order.payment_status, PAYMENT_STATUS);

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.orderCard}>
      {/* Order Header */}
      <div className={styles.orderHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.orderInfo}>
          <div className={styles.orderNumber}>
            <span className={styles.label}>Order #</span>
            <span className={styles.value}>{order.order_number}</span>
          </div>
          <div className={styles.orderDate}>
            <span className={styles.label}>Placed on</span>
            <span className={styles.value}>{formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className={styles.orderStatus}>
          <span
            className={styles.statusBadge}
            style={{ backgroundColor: orderStatus.color }}
          >
            {orderStatus.label}
          </span>
          <span
            className={styles.paymentBadge}
            style={{ backgroundColor: paymentStatus.color }}
          >
            {paymentStatus.label}
          </span>
        </div>

        <div className={styles.orderTotal}>
          <span className={styles.label}>Total</span>
          <span className={styles.amount}>
            {order.currency || "$"}{parseFloat(order.total_amount).toFixed(2)}
          </span>
        </div>

        <button className={styles.expandButton}>
          <i className="material-icons">
            {expanded ? "expand_less" : "expand_more"}
          </i>
        </button>
      </div>

      {/* Expanded Order Details */}
      {expanded && (
        <div className={styles.orderDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Order ID</span>
              <span className={styles.detailValue}>{order.order_id}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Method</span>
              <span className={styles.detailValue}>
                {order.payment_method || "N/A"}
              </span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={() => navigate(`/order/${order.order_id}`)}
              className={styles.viewDetailsButton}
            >
              <i className="material-icons">visibility</i>
              View Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
