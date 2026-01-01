///////////////////////////////////////////////////////////////////////
// ====================== ADMIN ORDERS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// This page displays order management with filters and status updates

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminOrders.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";

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
  const [sortConfig, setSortConfig] = useState({
    field: "created_at",
    order: "desc",
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters, sortConfig]);

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
      //   sortBy: sortConfig.field,
      //   sortOrder: sortConfig.order,
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

  const handleSort = (field) => {
    setSortConfig((prev) => {
      const newOrder = prev.field === field && prev.order === "asc" ? "desc" : "asc";
      return { field, order: newOrder };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== TABLE CONFIGURATION ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Column definitions for the orders table
  const columns = [
    { key: "id", label: "Order ID", sortable: true, sortField: "order_id" },
    { key: "customer", label: "Customer", sortable: true, sortField: "customer_name" },
    { key: "date", label: "Date", sortable: true, sortField: "created_at" },
    { key: "total", label: "Total", sortable: true, sortField: "total_amount" },
    { key: "status", label: "Status", sortable: true, sortField: "status" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Render function for table rows
  const renderRow = (order) => (
    <tr key={order.order_id}>
      <td>#{order.order_id}</td>
      <td>{order.customer_name}</td>
      <td>{new Date(order.created_at).toLocaleDateString()}</td>
      <td>${order.total_amount}</td>
      <td>
        <span className={`${viewStyles.badge} ${viewStyles[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td>
        <div className={viewStyles.actions}>
          <button className={styles.viewButton}>View</button>
        </div>
      </td>
    </tr>
  );

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminManagementView
      // Page configuration
      pageType={ADMIN_PAGE_TYPES.ORDERS}
      title="Order Management"
      // Search and filter props
      searchValue={filters.search}
      onSearchChange={(value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }}
      filters={filters}
      onFilterChange={handleFilterChange}
      // Loading and error states
      loading={loading}
      error={error}
      loadingText="Loading orders..."
      // Data and pagination
      data={orders}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage="No orders found"
      emptyHint="Orders will appear here once customers start purchasing"
      // Table configuration
      columns={columns}
      renderRow={renderRow}
      // Sorting
      sortConfig={sortConfig}
      onSort={handleSort}
    />
  );
}
