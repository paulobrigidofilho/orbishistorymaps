///////////////////////////////////////////////////////////////////////
// ======================= RATING MODAL ============================= //
///////////////////////////////////////////////////////////////////////

// Modal for displaying product rating breakdown and comments link
// Usage: Opens from product card rating click

import React from "react";
import styles from "./RatingModal.module.css";

export default function RatingModal({
  open,
  onClose,
  average,
  total,
  breakdown,
  onSeeAllComments,
}) {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.header}>
          <span className={styles.stars}>{'★'.repeat(Math.round(average))}</span>
          <span className={styles.average}>{average.toFixed(1)} out of 5</span>
        </div>
        <div className={styles.total}>{total} global ratings</div>
        <div className={styles.breakdown}>
          {[5,4,3,2,1].map(star => (
            <div key={star} className={styles.row}>
              <span>{star} star</span>
              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{width: `${breakdown[star] ? breakdown[star] : 0}%`}}
                />
              </div>
              <span>{breakdown[star] ? breakdown[star] : 0}%</span>
            </div>
          ))}
        </div>
        <button className={styles.commentsBtn} onClick={onSeeAllComments}>
          See all comments
        </button>
      </div>
    </div>
  );
}
