///////////////////////////////////////////////////////////////////////
// ====================== ADMIN USERS PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page displays user management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";
import UserEditModal from "./subcomponents/UserEditModal";
import DeleteUserModal from "./subcomponents/DeleteUserModal";

//  ========== Function imports  ========== //
import getAllUsers from "../../functions/getAllUsers";
import updateUserStatus from "../../functions/updateUserStatus";
import updateUserRole from "../../functions/updateUserRole";
import updateUser from "../../functions/updateUser";
import deleteUser from "../../functions/deleteUser";
import formatDateDMY from "../../functions/formatDateDMY";

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
  const [sortConfig, setSortConfig] = useState({
    field: "user_id",
    order: "desc",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchUsers = async () => {
    console.log("fetchUsers called with:", {
      sortBy: sortConfig.field,
      sortOrder: sortConfig.order,
      page: pagination.page,
    });
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        role: filters.role,
        status: filters.status,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });
      console.log("Received users data:", data.data?.map(u => ({ name: u.firstName, email: u.email })));
      setUsers([...data.data] || []); // Force new array reference
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (err) {
      setError(err.message);
      console.error(ERROR_MESSAGES.FETCH_USERS_ERROR, err);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters.search, filters.role, filters.status, sortConfig.field, sortConfig.order]);

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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userId, updates) => {
    try {
      await updateUser(userId, updates);
      fetchUsers(); // Refresh list
    } catch (err) {
      throw err; // Let modal handle the error
    }
  };

  const handleDeleteUser = (user) => {
    // Prevent deletion of admin accounts
    if (user.role === "admin") {
      alert("Admin accounts cannot be deleted.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async (userId) => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field) => {
    console.log("Sorting by:", field);
    setSortConfig((prev) => {
      const newOrder = prev.field === field && prev.order === "asc" ? "desc" : "asc";
      console.log("New sort config:", { field, order: newOrder });
      return { field, order: newOrder };
    });
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.order === "asc" ? "↑" : "↓";
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
                  <th className={styles.sortable} onClick={() => handleSort("user_id")}>
                    ID <span className={styles.sortIcon}>{getSortIcon("user_id")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_firstname")}>
                    First Name <span className={styles.sortIcon}>{getSortIcon("user_firstname")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_lastname")}>
                    Last Name <span className={styles.sortIcon}>{getSortIcon("user_lastname")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_email")}>
                    Email <span className={styles.sortIcon}>{getSortIcon("user_email")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_role")}>
                    Role <span className={styles.sortIcon}>{getSortIcon("user_role")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_status")}>
                    Status <span className={styles.sortIcon}>{getSortIcon("user_status")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_created_at")}>
                    Created <span className={styles.sortIcon}>{getSortIcon("user_created_at")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("user_updated_at")}>
                    Updated <span className={styles.sortIcon}>{getSortIcon("user_updated_at")}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`${styles.inlineSelect} ${styles[user.role]}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`${styles.inlineSelect} ${styles[user.status]}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td>{formatDateDMY(user.createdAt)}</td>
                    <td>{formatDateDMY(user.updatedAt)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditUser(user)}
                          title="Edit user profile"
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.deleteButton} ${user.role === 'admin' ? styles.disabled : ''}`}
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? "Admin accounts cannot be deleted" : "Delete user"}
                        >
                          Delete
                        </button>
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

      {/* User Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        user={userToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
}
