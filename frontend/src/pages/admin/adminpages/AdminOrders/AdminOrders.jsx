///////////////////////////////////////////////////////////////////////
// ====================== ADMIN ORDERS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// This page displays order management with filters and status updates

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminOrders.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";

///////////////////////////////////////////////////////////////////////
// ======================== ADMIN ORDERS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminOrders() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement order fetching API
      // const data = await getAllOrders({
      //   page: pagination.page,
      //   limit: pagination.limit,
      //   ...filters,
      // });
      // setOrders(data.data || []);
      // setPagination((prev) => ({ ...prev, ...data.pagination }));
      
      // Mock data for now
      setOrders([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.ordersPage}>
        <div className={styles.header}>
          <h1>Order Management</h1>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={filters.search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Loading State */}
        {loading && <div className={styles.loading}>Loading orders...</div>}

        {/* Orders Table */}
        {!loading && orders.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_name}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>${order.total_amount}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.viewButton}>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className={styles.emptyState}>
            <p>No orders found</p>
            <p className={styles.emptyHint}>
              Orders will appear here once customers start purchasing
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
