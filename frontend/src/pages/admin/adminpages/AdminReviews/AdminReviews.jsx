///////////////////////////////////////////////////////////////////////
// ======================= ADMIN REVIEWS PAGE ======================= //
///////////////////////////////////////////////////////////////////////

// Admin dashboard for managing all reviews
// Allows filtering, editing, deleting reviews

//  ========== Module imports  ========== //
import React, { useEffect, useState } from "react";
import styles from "./AdminReviews.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";
import ReviewEditModal from "./subcomponents/ReviewEditModal";
import DeleteReviewModal from "./subcomponents/DeleteReviewModal";
import { EditBtn, DeleteBtn } from "../../btn";

//  ========== Constants imports  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";

///////////////////////////////////////////////////////////////////////
// ======================== ADMIN REVIEWS PAGE ======================= //
///////////////////////////////////////////////////////////////////////

export default function AdminReviews() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [reviews, setReviews] = useState([]);
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
    rating: "",
    is_approved: "",
  });

  // Modal states
  const [editReview, setEditReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Build query string for admin review filters
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.is_approved) params.append("is_approved", filters.is_approved);
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);
      const query = params.toString() ? `?${params.toString()}` : "";
      
      const res = await fetch(`/api/admin/reviews${query}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      
      setReviews(data.data || data || []);
      if (data.pagination) {
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters.search, filters.rating, filters.is_approved]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditReview(null);
    setShowModal(false);
  };

  // Save handler for admin review edit modal
  const handleSave = async (reviewId, data) => {
    try {
      // PATCH approve if approved changed, else PUT update
      const method = "approved" in data ? "PATCH" : "PUT";
      const url = method === "PATCH"
        ? `/api/admin/reviews/${reviewId}/approve`
        : `/api/admin/reviews/${reviewId}`;
      const body = method === "PATCH" ? { approved: data.approved } : data;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setShowModal(false);
      setEditReview(null);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = (review) => {
    setDeleteReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteReview(null);
  };

  const handleConfirmDelete = async (reviewId) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      setShowDeleteModal(false);
      setDeleteReview(null);
      fetchReviews(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== TABLE CONFIGURATION ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Column definitions for the reviews table
  const columns = [
    { key: "product", label: "Product", sortable: false },
    { key: "user", label: "User", sortable: false },
    { key: "rating", label: "Rating", sortable: false },
    { key: "title", label: "Title", sortable: false },
    { key: "status", label: "Status", sortable: false },
    { key: "date", label: "Date", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Render function for table rows
  const renderRow = (review) => (
    <tr key={review.review_id || review._id}>
      <td>{review.product_name || review.productId?.name || "N/A"}</td>
      <td>{review.user_nickname || review.userId?.name || "N/A"}</td>
      <td>
        <span className={viewStyles.stars}>
          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
        </span>
      </td>
      <td>{review.review_title || review.title || "No title"}</td>
      <td>
        <span className={`${viewStyles.badge} ${review.is_approved ? viewStyles.approved : viewStyles.pending}`}>
          {review.is_approved ? "Approved" : "Pending"}
        </span>
      </td>
      <td>{new Date(review.created_at || review.createdAt).toLocaleDateString()}</td>
      <td>
        <div className={viewStyles.actions}>
          <EditBtn onClick={() => handleEdit(review)} />
          <DeleteBtn onClick={() => handleDelete(review)} />
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
      pageType={ADMIN_PAGE_TYPES.REVIEWS}
      title="Review Management"
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
      loadingText="Loading reviews..."
      // Data and pagination
      data={reviews}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage="No reviews found"
      emptyHint="Reviews will appear here once customers start reviewing products"
      // Table configuration
      columns={columns}
      renderRow={renderRow}
    >
      {/* Edit Modal */}
      <ReviewEditModal
        review={editReview}
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSave}
      />

      {/* Delete Modal */}
      <DeleteReviewModal
        review={deleteReview}
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </AdminManagementView>
  );
}
