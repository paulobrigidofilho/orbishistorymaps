///////////////////////////////////////////////////////////////////////
// ====================== ADMIN USERS PAGE =========================== //
///////////////////////////////////////////////////////////////////////

// This page displays user management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminUsers.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import UserEditModal from "./subcomponents/UserEditModal";
import DeleteUserModal from "./subcomponents/DeleteUserModal";
import CountryFlag from "../../components/CountryFlag";
import { EditBtn, DeleteBtn } from "../../btn";
import viewStyles from "../../components/AdminManagementView.module.css";

//  ========== Constants imports (Search)  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";

//  ========== Function imports  ========== //
import getAllUsers from "../../functions/getAllUsers";
import updateUserStatus from "../../functions/updateUserStatus";
import updateUserRole from "../../functions/updateUserRole";
import updateUser from "../../functions/updateUser";
import deleteUser from "../../functions/deleteUser";
import formatDateDMY from "../../helpers/formatDateDMY";

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
    country: "",
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
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        role: filters.role,
        status: filters.status,
        country: filters.country,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });
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
  }, [pagination.page, pagination.limit, filters.search, filters.role, filters.status, filters.country, sortConfig.field, sortConfig.order]);

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

  ///////////////////////////////////////////////////////////////////////
  // ====================== TABLE CONFIGURATION ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Column definitions for the users table
  const columns = [
    { key: "id", label: "ID", sortable: true, sortField: "user_id" },
    { key: "country", label: "Country", sortable: true, sortField: "user_country" },
    { key: "firstName", label: "First Name", sortable: true, sortField: "user_firstname" },
    { key: "lastName", label: "Last Name", sortable: true, sortField: "user_lastname" },
    { key: "email", label: "Email", sortable: true, sortField: "user_email" },
    { key: "role", label: "Role", sortable: true, sortField: "user_role" },
    { key: "status", label: "Status", sortable: true, sortField: "user_status" },
    { key: "createdAt", label: "Created", sortable: true, sortField: "user_created_at" },
    { key: "updatedAt", label: "Updated", sortable: true, sortField: "user_updated_at" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Render function for table rows
  const renderRow = (user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>
        <CountryFlag country={user.country} size="small" />
      </td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>
        <select
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          className={`${viewStyles.inlineSelect} ${viewStyles[user.role]}`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <select
          value={user.status}
          onChange={(e) => handleStatusChange(user.id, e.target.value)}
          className={`${viewStyles.inlineSelect} ${viewStyles[user.status]}`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </td>
      <td>{formatDateDMY(user.createdAt)}</td>
      <td>{formatDateDMY(user.updatedAt)}</td>
      <td>
        <div className={viewStyles.actions}>
          <EditBtn
            onClick={() => handleEditUser(user)}
            title="Edit user profile"
          />
          <DeleteBtn
            onClick={() => handleDeleteUser(user)}
            disabled={user.role === "admin"}
            title={user.role === "admin" ? "Admin accounts cannot be deleted" : "Delete user"}
          />
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
      pageType={ADMIN_PAGE_TYPES.USERS}
      title="User Management"
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
      loadingText="Loading users..."
      // Data and pagination
      data={users}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage="No users found"
      emptyHint="Try adjusting your search or filters"
      // Table configuration
      columns={columns}
      renderRow={renderRow}
      // Sorting
      sortConfig={sortConfig}
      onSort={handleSort}
    >
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
    </AdminManagementView>
  );
}
