///////////////////////////////////////////////////////////////////////
// ======================== MY ORDERS PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page displays the user's order history

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyOrders.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../MainNavBar";
import OrderCard from "./components/OrderCard";

//  ========== Function imports  ========== //
import getUserOrders from "./functions/getUserOrders";

//  ========== Context imports  ========== //
import { AuthContext } from "../context/AuthContext";

//  ========== Constants imports  ========== //
import { ORDER_ERROR_MESSAGES } from "./constants/orderConstants";

///////////////////////////////////////////////////////////////////////
// ========================= MY ORDERS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

export default function MyOrders() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch orders on component mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch orders data
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserOrders(50, 0);
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message || ORDER_ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Calculate order count
  const orderCount = orders?.length || 0;

  ///////////////////////////////////////////////////////////////////////
  // ========================= NOT LOGGED IN STATE =================== //
  ///////////////////////////////////////////////////////////////////////

  if (!user) {
    return (
      <div className={styles.ordersPage}>
        <MainNavBar />
        <div className={styles.emptyContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#3498db" }}>
            receipt_long
          </i>
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your orders.</p>
          <button onClick={() => navigate("/register")} className={styles.actionButton}>
            Sign Up / Login
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.ordersPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.ordersPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={loadOrders} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= EMPTY STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (!orders || orderCount === 0) {
    return (
      <div className={styles.ordersPage}>
        <MainNavBar />
        <div className={styles.emptyContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#bdc3c7" }}>
            receipt_long
          </i>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping!</p>
          <button onClick={() => navigate("/shop")} className={styles.actionButton}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.ordersPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Orders Container */}
      <div className={styles.ordersContainer}>
        {/* Page Header */}
        <div className={styles.ordersHeader}>
          <h1>
            <i className="material-icons" style={{ color: "#3498db", verticalAlign: "middle", marginRight: "0.5rem" }}>
              receipt_long
            </i>
            My Orders
          </h1>
          <p>{orderCount} {orderCount === 1 ? "order" : "orders"}</p>
        </div>

        {/* Orders List */}
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>

        {/* Continue Shopping Button */}
        <div className={styles.actionsContainer}>
          <button
            onClick={() => navigate("/shop")}
            className={styles.continueShoppingButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
