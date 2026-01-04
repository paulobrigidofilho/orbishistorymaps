///////////////////////////////////////////////////////////////////////
// =================== REVIEW STAT CARD COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This component displays the review statistics card with approved/pending breakdown
// Used on the AdminDashboard to show review counts by status

//  ========== Module imports  ========== //
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./ReviewStatCard.module.css";

//  ========== Constants imports  ========== //
import { REVIEW_STAT_CARD } from "../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// =================== REVIEW STAT CARD COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

/**
 * ReviewStatCard - Displays review statistics with approved/pending breakdown
 * @param {Object} props - Component props
 * @param {number} props.total - Total number of reviews
 * @param {number} props.approved - Number of approved reviews
 * @param {number} props.pending - Number of pending reviews
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} The review stat card component
 */
export default function ReviewStatCard({ 
  total = 0, 
  approved = 0, 
  pending = 0, 
  isLoading = false 
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <Link to={REVIEW_STAT_CARD.to} className={styles.reviewStatCard}>
      {/* Icon */}
      <div className={styles.statIcon}>{REVIEW_STAT_CARD.icon}</div>

      {/* Content */}
      <div className={styles.statContent}>
        <h3>{REVIEW_STAT_CARD.label}</h3>
        <p className={styles.statValue}>{isLoading ? "..." : total}</p>

        {/* Breakdown Section */}
        {!isLoading && (
          <div className={styles.breakdown}>
            <div className={styles.breakdownItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: REVIEW_STAT_CARD.breakdownColors.approved }}
              />
              <span className={styles.breakdownLabel}>
                {REVIEW_STAT_CARD.breakdownLabels.approved}:
              </span>
              <span className={styles.breakdownValue}>{approved}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: REVIEW_STAT_CARD.breakdownColors.pending }}
              />
              <span className={styles.breakdownLabel}>
                {REVIEW_STAT_CARD.breakdownLabels.pending}:
              </span>
              <span className={styles.breakdownValue}>{pending}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================= //
///////////////////////////////////////////////////////////////////////

ReviewStatCard.propTypes = {
  total: PropTypes.number,
  approved: PropTypes.number,
  pending: PropTypes.number,
  isLoading: PropTypes.bool,
};
