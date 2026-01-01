///////////////////////////////////////////////////////////////////////
// =================== ADMIN MANAGEMENT VIEW COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

// Reusable template component for admin management pages
// Provides consistent layout with header, search, table, pagination
// Uses conditional rendering based on props for each admin page type

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminManagementView.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "./AdminLayout";
import AdminSearchBar from "./searchbar/AdminSearchBar";
import { PageBtn } from "../btn";

///////////////////////////////////////////////////////////////////////
// =================== ADMIN MANAGEMENT VIEW COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

export default function AdminManagementView({
  // Page configuration
  pageType,
  title,
  
  // Header action button (optional, e.g., "Add Product")
  headerAction,
  
  // Search and filter props
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  dynamicOptions,
  
  // Loading and error states
  loading,
  error,
  loadingText = "Loading...",
  
  // Data and pagination
  data,
  pagination,
  onPageChange,
  
  // Empty state
  emptyMessage = "No items found",
  emptyHint = "",
  
  // Table configuration
  columns,
  renderRow,
  tableClassName,
  
  // Sorting (optional)
  sortConfig,
  onSort,
  
  // Children for modals or additional content
  children,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get sort icon for sortable columns
  const getSortIcon = (field) => {
    if (!sortConfig || sortConfig.field !== field) return "↕";
    return sortConfig.order === "asc" ? "↑" : "↓";
  };

  // Handle column header click for sorting
  const handleHeaderClick = (column) => {
    if (column.sortable && onSort) {
      onSort(column.sortField || column.key);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.managementPage}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1>{title}</h1>
          {headerAction && (
            <div className={styles.headerActions}>
              {headerAction}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <AdminSearchBar
          pageType={pageType}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          dynamicOptions={dynamicOptions}
        />

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Loading State */}
        {loading && <div className={styles.loading}>{loadingText}</div>}

        {/* Data Table */}
        {!loading && data && data.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={`${styles.dataTable} ${tableClassName || ""}`}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={column.sortable ? styles.sortable : ""}
                      onClick={() => handleHeaderClick(column)}
                      style={column.width ? { width: column.width } : {}}
                    >
                      {column.label}
                      {column.sortable && (
                        <span className={styles.sortIcon}>
                          {getSortIcon(column.sortField || column.key)}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => renderRow(item, index))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && (!data || data.length === 0) && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>{emptyMessage}</p>
            {emptyHint && <p className={styles.emptyHint}>{emptyHint}</p>}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <PageBtn
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </PageBtn>
            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <PageBtn
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </PageBtn>
          </div>
        )}

        {/* Additional Content (Modals, etc.) */}
        {children}
      </div>
    </AdminLayout>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN MANAGEMENT VIEW COMPONENT ========== //
///////////////////////////////////////////////////////////////////////
