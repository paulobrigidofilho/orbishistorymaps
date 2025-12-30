///////////////////////////////////////////////////////////////////////
// ======================= ADMIN REVIEWS PAGE ======================= //
///////////////////////////////////////////////////////////////////////

// Admin dashboard for managing all reviews
// Allows filtering, editing, deleting reviews


import React, { useEffect, useState } from "react";
import styles from "./AdminReviews.module.css";
import ReviewEditModal from "./subcomponents/ReviewEditModal";
import DeleteReviewModal from "./subcomponents/DeleteReviewModal";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState({ product: "", user: "", rating: "" });
  const [editReview, setEditReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Build query string for admin review filters
    const params = new URLSearchParams();
    if (filter.product) params.append("productId", filter.product);
    if (filter.user) params.append("userId", filter.user);
    if (filter.rating) params.append("rating", filter.rating);
    const query = params.toString() ? `?${params.toString()}` : "";
    fetch(`/api/admin/reviews${query}`)
      .then(res => res.json())
      .then(setReviews);
  }, [filter, showModal]);

  const handleEdit = (review) => {
    setEditReview(review);
    setShowModal(true);
  };

  // Save handler for admin review edit modal
  const handleSave = async (reviewId, data) => {
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
    // Refresh reviews
    const params = new URLSearchParams();
    if (filter.product) params.append("productId", filter.product);
    if (filter.user) params.append("userId", filter.user);
    if (filter.rating) params.append("rating", filter.rating);
    const query = params.toString() ? `?${params.toString()}` : "";
    const updated = await fetch(`/api/admin/reviews${query}`).then(r => r.json());
    setReviews(updated);
  };
  const handleDelete = (review) => {
    setDeleteReview(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (reviewId) => {
    setIsDeleting(true);
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    setReviews(reviews.filter(r => r._id !== reviewId));
    setIsDeleting(false);
    setShowDeleteModal(false);
    setDeleteReview(null);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteReview(null);
  };
  const handleModalClose = () => {
    setEditReview(null);
    setShowModal(false);
  };

  return (
    <div className={styles.adminReviewsPage}>
      <h2>All Reviews</h2>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Filter by product ID"
          value={filter.product}
          onChange={e => setFilter({ ...filter, product: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by user ID"
          value={filter.user}
          onChange={e => setFilter({ ...filter, user: e.target.value })}
        />
        <select
          value={filter.rating}
          onChange={e => setFilter({ ...filter, rating: e.target.value })}
        >
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(r => (
            <option key={r} value={r}>{r} star</option>
          ))}
        </select>
      </div>
      <div className={styles.reviewList}>
        {reviews.map(r => (
          <div key={r._id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className={styles.user}>{r.userId.name}</span>
              <span className={styles.product}>{r.productId.name}</span>
              <span className={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.comment}>{r.comment}</div>
            <button onClick={() => handleEdit(r)}>Edit</button>
            <button onClick={() => handleDelete(r)}>Delete</button>
          </div>
        ))}
      </div>
      <ReviewEditModal
        review={editReview}
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSave}
      />
      <DeleteReviewModal
        review={deleteReview}
        isOpen={showDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
