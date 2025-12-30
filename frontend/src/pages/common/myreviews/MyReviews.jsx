///////////////////////////////////////////////////////////////////////
// ======================= MY REVIEWS PAGE ========================== //
///////////////////////////////////////////////////////////////////////

// Displays all reviews submitted by the current user
// Allows editing/deleting reviews

import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./MyReviews.module.css";
import ReviewModal from "./components/ReviewModal";
import { REVIEW_MESSAGES } from "./constants/reviewConstants";
import getUserReviews from "./functions/getUserReviews";
import deleteReview from "./functions/deleteReview";
import { formatReviewDate } from "./helpers/formatReviewDate";
import { EditReviewBtn, DeleteReviewBtn } from "./btn";

export default function MyReviews() {
  const { user } = useContext(AuthContext);
  const userId = user?.user_id;
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getUserReviews(userId).then(setReviews);
  }, [userId, showModal]);

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

  if (!userId) {
    return <div className={styles.noReviews}>Please log in to view your reviews.</div>;
  }

  return (
    <div className={styles.myReviewsPage}>
      <h2>My Reviews</h2>
      {reviews.length === 0 ? (
        <div className={styles.noReviews}>{REVIEW_MESSAGES.NO_USER_REVIEWS}</div>
      ) : (
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
      )}
      <ReviewModal
        open={showModal}
        onClose={handleModalClose}
        productId={editReview ? editReview.productId._id : null}
        userId={userId}
        review={editReview}
        onSuccess={handleModalClose}
      />
    </div>
  );
}
