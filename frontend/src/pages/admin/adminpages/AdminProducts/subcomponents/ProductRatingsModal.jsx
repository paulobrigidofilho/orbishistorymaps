///////////////////////////////////////////////////////////////////////
// =================== PRODUCT RATINGS MODAL ======================== //
///////////////////////////////////////////////////////////////////////

// This component displays a modal with rating breakdown for a product
// Shows percentage of 5, 4, 3, 2, 1-star ratings like Amazon
// Includes link to view reviews filtered by this product

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductRatingsModal.module.css";
import { CloseBtn } from "../../../btn";

///////////////////////////////////////////////////////////////////////
// =================== PRODUCT RATINGS MODAL ========================= //
///////////////////////////////////////////////////////////////////////

export default function ProductRatingsModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isOpen && product) {
      fetchRatingsBreakdown();
    }
  }, [isOpen, product]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchRatingsBreakdown = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/reviews/product/${product.product_id}/breakdown`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch ratings breakdown");
      }
      const data = await res.json();
      setRatingsData(data);
    } catch (err) {
      console.error("Error fetching ratings:", err);
      // If endpoint doesn't exist, calculate from available data
      setRatingsData({
        totalReviews: product.rating_count || 0,
        averageRating: product.rating_average || 0,
        breakdown: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReviews = () => {
    onClose();
    navigate(`/admin/reviews?search=${encodeURIComponent(product.product_name)}`);
  };

  const handleClose = () => {
    setRatingsData(null);
    setError(null);
    onClose();
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= CALCULATIONS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const calculatePercentage = (count, total) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!isOpen) return null;

  const totalReviews = ratingsData?.totalReviews || product?.rating_count || 0;
  const averageRating = ratingsData?.averageRating || product?.rating_average || 0;
  const breakdown = ratingsData?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Rating Breakdown</h2>
          <CloseBtn onClick={handleClose} />
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <h3>{product?.product_name}</h3>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading ratings...</div>
        ) : (
          <>
            {/* Average Rating */}
            <div className={styles.averageRating}>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(averageRating) ? styles.starFilled : styles.starEmpty}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.ratingValue}>
                {parseFloat(averageRating).toFixed(1)} out of 5
              </span>
              <span className={styles.totalReviews}>
                {totalReviews.toLocaleString()} global rating{totalReviews !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Rating Bars */}
            <div className={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = breakdown[star] || 0;
                const percentage = calculatePercentage(count, totalReviews);
                
                return (
                  <div key={star} className={styles.ratingRow}>
                    <span className={styles.starLabel}>{star} star</span>
                    <div className={styles.barContainer}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={styles.percentage}>{percentage}%</span>
                  </div>
                );
              })}
            </div>

            {/* View Reviews Button */}
            <div className={styles.modalActions}>
              <button
                className={styles.viewReviewsBtn}
                onClick={handleViewReviews}
              >
                See customer reviews →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
