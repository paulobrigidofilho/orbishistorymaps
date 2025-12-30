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

export default function ProductReviewsSection({ productId, userId }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Fetch all reviews for product
    fetch(`/api/reviews/product/${productId}`)
      .then(res => res.json())
      .then(data => {
        // Map backend fields to expected frontend structure
        const mapped = Array.isArray(data) ? data.map(r => ({
          _id: r.review_id,
          rating: r.rating,
          comment: r.review_text, // backend: review_text, frontend: comment
          userId: {
            _id: r.user_id,
            name: r.user_nickname || "User",
            avatar: r.user_avatar || ""
          },
          createdAt: r.created_at
        })) : [];
        setReviews(mapped);
        const found = mapped.find(r => r.userId._id === userId);
        setUserReview(found || null);
      });
  }, [productId, userId, showModal]);

  const handleWriteReview = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowModal(true);
    }
  };
  const handleModalClose = () => setShowModal(false);
  const handleLoginModalClose = () => setShowLoginModal(false);

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
                <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className={styles.user}>{r.userId.name}</span>
                <span className={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.comment}>{r.comment}</div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.userReviewActions}>
        {!userReview && <button onClick={handleWriteReview}>Write a review</button>}
      </div>
      <ReviewModal
        open={showModal}
        onClose={handleModalClose}
        productId={productId}
        userId={userId}
        review={userReview}
        onSuccess={() => setShowModal(false)}
      />
      {showLoginModal && <LoginModal onClose={handleLoginModalClose} />}
    </div>
  );
}
