///////////////////////////////////////////////////////////////////////
// ======================= ADMIN REVIEWS PAGE ======================= //
///////////////////////////////////////////////////////////////////////

// Admin dashboard for managing all reviews
// Allows filtering, editing, deleting reviews

//  ========== Module imports  ========== //
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AdminReviews.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";
import ReviewEditModal from "./subcomponents/ReviewEditModal";
import DeleteReviewModal from "./subcomponents/DeleteReviewModal";
import ViewUserDetailsModal from "./subcomponents/ViewUserDetailsModal";
import { ViewBtn, DeleteBtn } from "../../btn";

//  ========== Constants imports  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";

///////////////////////////////////////////////////////////////////////
// ======================== ADMIN REVIEWS PAGE ======================= //
///////////////////////////////////////////////////////////////////////

export default function AdminReviews() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HOOKS ================================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hoverTimeoutRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [reviews, setReviews] = useState([]);
  
  // User hover modal state
  const [hoveredUser, setHoveredUser] = useState(null);
  const [hoverModalVisible, setHoverModalVisible] = useState(false);
  const [hoverModalPosition, setHoverModalPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
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
      
      const res = await fetch(`/api/admin/reviews${query}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        let errorMessage = "Failed to fetch reviews";
        try {
          const error = await res.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // Response body is not JSON or empty
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      
      setReviews(data.reviews || data.data || data || []);
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
      // Use is_approved instead of approved for backend
      const url = `/api/admin/reviews/${reviewId}`;
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: data.rating,
          review_title: data.review_title,
          review_text: data.review_text,
          is_approved: data.is_approved,
        }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setShowModal(false);
      setEditReview(null);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      throw err;
    }
  };

  // Toggle approval status directly
  const handleToggleApproval = async (review) => {
    try {
      const newStatus = !review.is_approved;
      const res = await fetch(`/api/admin/reviews/${review.review_id}/approve`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update approval status");
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Error toggling approval:", err);
      alert(`Error: ${err.message}`);
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
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete review");
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
  // ================ USER HOVER MODAL HANDLERS ====================== //
  ///////////////////////////////////////////////////////////////////////

  const handleUserMouseEnter = (event, user) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Calculate position relative to viewport
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverModalPosition({
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 340), // Prevent overflow
    });
    setHoveredUser(user);

    // Small delay before showing modal for better UX
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverModalVisible(true);
    }, 200);
  };

  const handleUserMouseLeave = () => {
    // Clear the show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Small delay before hiding to allow moving to modal
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverModalVisible(false);
      setHoveredUser(null);
    }, 150);
  };

  const handleModalMouseEnter = () => {
    // Cancel hide timeout when mouse enters modal
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleModalMouseLeave = () => {
    // Hide modal when mouse leaves it
    setHoverModalVisible(false);
    setHoveredUser(null);
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ PRODUCT NAVIGATION HANDLER ===================== //
  ///////////////////////////////////////////////////////////////////////

  const handleProductClick = (productName) => {
    navigate(`/admin/products?search=${encodeURIComponent(productName)}`);
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
  const renderRow = (review) => {
    const productName = review.product?.product_name || review.product_name || "N/A";
    const user = review.user || {
      user_nickname: review.user_nickname,
      user_firstname: review.user_firstname,
      user_lastname: review.user_lastname,
      user_email: review.user_email,
      user_avatar: review.user_avatar,
    };

    return (
      <tr key={review.review_id || review._id}>
        {/* Product Name - Clickable for navigation */}
        <td>
          <span
            className={styles.clickableProduct}
            onClick={() => handleProductClick(productName)}
            title={`View ${productName} in Products`}
          >
            {productName}
          </span>
        </td>
        {/* User - Hover for details modal */}
        <td>
          <span
            className={styles.hoverableUser}
            onMouseEnter={(e) => handleUserMouseEnter(e, user)}
            onMouseLeave={handleUserMouseLeave}
          >
            {user.user_nickname || "N/A"}
          </span>
        </td>
        <td>
          <span className={viewStyles.stars}>
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </span>
        </td>
        <td>{review.review_title || review.title || "No title"}</td>
        <td>
          <button
            className={`${viewStyles.badge} ${viewStyles.clickable} ${review.is_approved ? viewStyles.approved : viewStyles.pending}`}
            onClick={() => handleToggleApproval(review)}
            title={`Click to ${review.is_approved ? "unapprove" : "approve"}`}
          >
            {review.is_approved ? "Approved" : "Pending"}
          </button>
        </td>
        <td>{new Date(review.created_at || review.createdAt).toLocaleDateString()}</td>
        <td>
          <div className={viewStyles.actions}>
            <ViewBtn onClick={() => handleEdit(review)} />
            <DeleteBtn onClick={() => handleDelete(review)} />
          </div>
        </td>
      </tr>
    );
  };

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
      {/* User Details Hover Modal */}
      <ViewUserDetailsModal
        user={hoveredUser}
        isVisible={hoverModalVisible}
        position={hoverModalPosition}
        onMouseEnter={handleModalMouseEnter}
        onMouseLeave={handleModalMouseLeave}
      />

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
