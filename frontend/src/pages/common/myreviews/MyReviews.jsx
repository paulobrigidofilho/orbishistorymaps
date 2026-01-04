///////////////////////////////////////////////////////////////////////
// ======================= MY REVIEWS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// Displays all reviews submitted by the current user
// Allows editing/deleting reviews

//  ========== Module imports  ========== //
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyReviews.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../MainNavBar";
import ReviewModal from "./components/ReviewModal";
import LoginRequired from "../components/LoginRequired";
import LoginModal from "../auth/LoginModal";
import AlertModal from "../components/AlertModal";

//  ========== Function imports  ========== //
import getUserReviews from "./functions/getUserReviews";
import deleteReview from "./functions/deleteReview";

//  ========== Helper imports  ========== //
import { formatReviewDate } from "./helpers/formatReviewDate";

//  ========== Button imports  ========== //
import { EditReviewBtn, DeleteReviewBtn } from "./btn";

//  ========== Context imports  ========== //
import { AuthContext } from "../context/AuthContext.jsx";

//  ========== Constants imports  ========== //
import { REVIEW_MESSAGES } from "./constants/reviewConstants";
import { REVIEW_ALERT_MESSAGES } from "../constants/alertModalConstants";

///////////////////////////////////////////////////////////////////////
// ========================= MY REVIEWS PAGE ========================= //
///////////////////////////////////////////////////////////////////////

export default function MyReviews() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Alert Modal state for delete confirmation
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    config: {},
    onConfirm: null,
  });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadReviews();
  }, [user, showModal]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

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

  // Request delete - opens confirmation modal
  const handleDelete = (reviewId) => {
    setPendingDeleteId(reviewId);
    setAlertModal({
      isOpen: true,
      config: REVIEW_ALERT_MESSAGES.DELETE_REVIEW,
      onConfirm: () => confirmDelete(reviewId),
    });
  };

  // Actually delete after confirmation
  const confirmDelete = async (reviewId) => {
    closeAlertModal();
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r.review_id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      // Show error modal
      setAlertModal({
        isOpen: true,
        config: {
          ...REVIEW_ALERT_MESSAGES.DELETE_FAILED,
          message: "Failed to delete review: " + (err.message || "Unknown error"),
        },
        onConfirm: closeAlertModal,
      });
    }
  };

  // Close alert modal
  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, config: {}, onConfirm: null });
    setPendingDeleteId(null);
  };

  const handleModalClose = () => {
    setEditReview(null);
    setShowModal(false);
    loadReviews(); // Refresh after edit
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= NOT LOGGED IN STATE =================== //
  ///////////////////////////////////////////////////////////////////////

  if (!user) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <LoginRequired
          icon="rate_review"
          title="Please Log In"
          message="You need to be logged in to view your reviews."
          iconColor="#f39c12"
          onLoginClick={() => setShowLoginModal(true)}
        />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <div className={styles.emptyIcon}>
            <i className="material-icons" style={{ fontSize: "3rem", color: "#e74c3c" }}>
              error_outline
            </i>
          </div>
          <h2>Error Loading Reviews</h2>
          <p>{error}</p>
          <button onClick={loadReviews} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= EMPTY STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.myReviewsPage}>
        <MainNavBar />
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <i className="material-icons" style={{ fontSize: "3rem", color: "#bdc3c7" }}>
              rate_review
            </i>
          </div>
          <h2>No Reviews Yet</h2>
          <p>You haven't submitted any reviews yet. Start shopping and share your thoughts!</p>
          <button onClick={() => navigate("/shop")} className={styles.actionButton}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= MAIN CONTENT ========================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.myReviewsPage}>
      <MainNavBar />
      <div className={styles.reviewsContainer}>
        {/* Header */}
        <div className={styles.reviewsHeader}>
          <h1>
            <i className="material-icons" style={{ color: "#f39c12", verticalAlign: "middle", marginRight: "0.5rem" }}>
              rate_review
            </i>
            My Reviews
          </h1>
          <p>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
        </div>

        {/* Reviews List */}
        <div className={styles.reviewList}>
          {reviews.map(r => (
            <div key={r.review_id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <span className={styles.stars}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </span>
                <span className={styles.product}>{r.product_name}</span>
                <span className={styles.date}>{formatReviewDate(r.created_at)}</span>
              </div>
              {r.review_title && (
                <div className={styles.reviewTitle}>{r.review_title}</div>
              )}
              <div className={styles.comment}>{r.review_text}</div>
              <div className={styles.reviewActions}>
                <EditReviewBtn onClick={() => handleEdit(r)} />
                <DeleteReviewBtn onClick={() => handleDelete(r.review_id)} />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actionsContainer}>
          <button
            onClick={() => navigate("/shop")}
            className={styles.continueShoppingButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <ReviewModal
        open={showModal}
        onClose={handleModalClose}
        productId={editReview ? editReview.product_id : null}
        userId={user.id}
        review={editReview}
        onSuccess={handleModalClose}
      />

      {/* Alert Modal for Delete Confirmation */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        onConfirm={alertModal.onConfirm}
        type={alertModal.config.type}
        title={alertModal.config.title}
        message={alertModal.config.message}
        confirmText={alertModal.config.confirmText}
        cancelText={alertModal.config.cancelText}
        showCancel={alertModal.config.showCancel !== false}
        icon={alertModal.config.icon}
      />
    </div>
  );
}
