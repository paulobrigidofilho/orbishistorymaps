///////////////////////////////////////////////////////////////////////
// =================== PRODUCT REVIEWS SECTION ====================== //
///////////////////////////////////////////////////////////////////////

// Displays all reviews for a product below product info
// Shows 'No reviews yet' if empty
// Allows user to write/edit their review

import React, { useEffect, useState, useContext } from "react";
import styles from "./ProductReviewsSection.module.css";
import ReviewModal from "../../common/myreviews/components/ReviewModal";
import { AuthContext } from "../../common/context/AuthContext";
import LoginModal from "../../common/auth/LoginModal";
import FadeNotification from "../../common/components/FadeNotification";

export default function ProductReviewsSection({ productId, userId }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch approved reviews for product (visible to everyone)
  useEffect(() => {
    fetch(`/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        // Map backend fields to expected frontend structure
        const mapped = Array.isArray(data) ? data.map(r => ({
          _id: r.review_id,
          review_id: r.review_id,
          rating: r.rating,
          comment: r.review_text,
          review_text: r.review_text,
          review_title: r.review_title,
          userId: {
            _id: r.user_id,
            name: r.user_nickname || "User",
            avatar: r.user_avatar || ""
          },
          user_id: r.user_id,
          createdAt: r.created_at
        })) : [];
        setReviews(mapped);
      })
      .catch(err => console.error("Error fetching reviews:", err));
  }, [productId, refreshKey]);

  // Fetch user's own review (including pending) to check if they already reviewed
  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/reviews/user/${user.id}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          // Find if user has a review for this product (approved or pending)
          const userReviewForProduct = Array.isArray(data)
            ? data.find(r => r.product_id === productId)
            : null;
          if (userReviewForProduct) {
            setUserReview({
              _id: userReviewForProduct.review_id,
              review_id: userReviewForProduct.review_id,
              rating: userReviewForProduct.rating,
              comment: userReviewForProduct.review_text,
              review_text: userReviewForProduct.review_text,
              review_title: userReviewForProduct.review_title,
              is_approved: userReviewForProduct.is_approved,
            });
          } else {
            setUserReview(null);
          }
        })
        .catch(err => console.error("Error fetching user reviews:", err));
    } else {
      setUserReview(null);
    }
  }, [user, productId, refreshKey]);

  const handleWriteReview = () => {
    if (!user) {
      setShowLoginModal(true);
    } else if (userReview) {
      // User already has a review for this product
      setNotification({
        type: "info",
        text: "You have already reviewed this product. Only one review per product is allowed.",
      });
    } else {
      setShowModal(true);
    }
  };

  const handleEditReview = () => {
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);
  const handleLoginModalClose = () => setShowLoginModal(false);

  const handleReviewSuccess = (isUpdate) => {
    setShowModal(false);
    setNotification({
      type: "success",
      text: isUpdate ? "Review updated successfully!" : "Review submitted successfully!",
    });
    setRefreshKey(prev => prev + 1); // Trigger refetch
  };

  return (
    <div className={styles.reviewsSection} id="reviews">
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <div className={styles.noReviews}>No reviews yet.</div>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map(r => (
            <div key={r._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewMeta}>
                  <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className={styles.user}>{r.userId.name}</span>
                  <span className={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {/* Show edit button if this review belongs to the logged-in user */}
                {user && r.user_id === user.id && (
                  <button
                    className={styles.editBtn}
                    onClick={handleEditReview}
                    title="Edit your review"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
              {r.review_title && <div className={styles.reviewTitle}>{r.review_title}</div>}
              <div className={styles.comment}>{r.comment}</div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.userReviewActions}>
        {userReview ? (
          <button onClick={handleEditReview}>Edit your review</button>
        ) : (
          <button onClick={handleWriteReview}>Write a review</button>
        )}
      </div>
      {notification && (
        <FadeNotification
          type={notification.type}
          text={notification.text}
          duration={4000}
          position="top"
          onComplete={() => setNotification(null)}
        />
      )}
      <ReviewModal
        open={showModal}
        onClose={handleModalClose}
        productId={productId}
        userId={userId}
        review={userReview}
        onSuccess={handleReviewSuccess}
      />
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </div>
  );
}
