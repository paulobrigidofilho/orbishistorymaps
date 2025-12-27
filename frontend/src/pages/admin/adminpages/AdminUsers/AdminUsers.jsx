///////////////////////////////////////////////////////////////////////
// ====================== ADMIN USERS PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page displays user management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";

//  ========== Function imports  ========== //
import getAllUsers from "../../functions/getAllUsers";
import updateUserStatus from "../../functions/updateUserStatus";
import updateUserRole from "../../functions/updateUserRole";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";

///////////////////////////////////////////////////////////////////////
// ======================== ADMIN USERS PAGE ========================= //
///////////////////////////////////////////////////////////////////////

export default function AdminUsers() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [users, setUsers] = useState([]);
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
    role: "",
    status: "",
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setUsers(data.data || []);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (err) {
      setError(err.message);
      console.error(ERROR_MESSAGES.FETCH_USERS_ERROR, err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!window.confirm(`Change user status to ${newStatus}?`)) return;

    try {
      await updateUserStatus(userId, newStatus);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await updateUserRole(userId, newRole);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
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
      <div className={styles.usersPage}>
        <div className={styles.header}>
          <h1>User Management</h1>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Loading State */}
        {loading && <div className={styles.loading}>Loading users...</div>}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                          className={styles.actionSelect}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.user_id, e.target.value)}
                          className={styles.actionSelect}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className={styles.emptyState}>No users found</div>
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
