///////////////////////////////////////////////////////////////////////
// ======================= MY REVIEWS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// Displays all reviews submitted by the current user
// Allows editing/deleting reviews

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyReviews.module.css";
import MainNavBar from "../MainNavBar";
import ReviewModal from "./components/ReviewModal";
import { REVIEW_MESSAGES } from "./constants/reviewConstants";
import getUserReviews from "./functions/getUserReviews";
import deleteReview from "./functions/deleteReview";
import { formatReviewDate } from "./helpers/formatReviewDate";
import { EditReviewBtn, DeleteReviewBtn } from "./btn";
import { AuthContext } from "../context/AuthContext.jsx";

export default function MyReviews() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadReviews();
  }, [user, showModal]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserReviews(user.id);
      setReviews(data || []);
    } catch (err) {
      setError(err.message || REVIEW_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setShowModal(true);
  };
  const handleDelete = async (reviewId) => {
    await deleteReview(reviewId);
    setReviews(reviews.filter(r => r._id !== reviewId));
  };
  const handleModalClose = () => {
    setEditReview(null);
    setShowModal(false);
  };

  // Not logged in state
  if (!user) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.emptyContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#f39c12" }}>
            rate_review
          </i>
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your reviews.</p>
          <button onClick={() => navigate("/register")} className={styles.actionButton}>
            Sign Up / Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <h2>Error Loading Reviews</h2>
          <p>{error}</p>
          <button onClick={loadReviews} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.emptyContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#bdc3c7" }}>
            rate_review
          </i>
          <h2>No Reviews Yet</h2>
          <p>You haven't submitted any reviews yet.</p>
          <button onClick={() => navigate("/shop")} className={styles.actionButton}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className={styles.myReviewsPage}>
      <MainNavBar />
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <h1>
            <i className="material-icons" style={{ color: "#f39c12", verticalAlign: "middle", marginRight: "0.5rem" }}>
              rate_review
            </i>
            My Reviews
          </h1>
          <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
        </div>
        <div className={styles.reviewList}>
          {reviews.map(r => (
            <div key={r._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className={styles.product}>{r.productId.name}</span>
                <span className={styles.date}>{formatReviewDate(r.createdAt)}</span>
              </div>
              <div className={styles.comment}>{r.comment}</div>
              <EditReviewBtn onClick={() => handleEdit(r)} />
              <DeleteReviewBtn onClick={() => handleDelete(r._id)} />
            </div>
          ))}
        </div>
        <div className={styles.actionsContainer}>
          <button
            onClick={() => navigate("/shop")}
            className={styles.continueShoppingButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <ReviewModal
        open={showModal}
        onClose={handleModalClose}
        productId={editReview ? editReview.productId._id : null}
        userId={user.id}
        review={editReview}
        onSuccess={handleModalClose}
      />
    </div>
  );
}
