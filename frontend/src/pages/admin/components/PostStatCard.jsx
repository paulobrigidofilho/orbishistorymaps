///////////////////////////////////////////////////////////////////////
// =================== POST STAT CARD COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component displays the post statistics card with published/draft breakdown
// Used on the AdminDashboard to show post counts by status

//  ========== Module imports  ========== //
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./PostStatCard.module.css";

//  ========== Constants imports  ========== //
import { POST_STAT_CARD } from "../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// =================== POST STAT CARD COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

/**
 * PostStatCard - Displays post statistics with published/scheduled/draft breakdown
 * @param {Object} props - Component props
 * @param {number} props.total - Total number of posts
 * @param {number} props.published - Number of published posts
 * @param {number} props.scheduled - Number of scheduled posts
 * @param {number} props.draft - Number of draft posts
 * @param {boolean} props.isLoading - Loading state
 * @returns {React.ReactElement} The post stat card component
 */
export default function PostStatCard({ 
  total = 0, 
  published = 0, 
  scheduled = 0,
  draft = 0, 
  isLoading = false 
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <Link to={POST_STAT_CARD.to} className={styles.postStatCard}>
      {/* Icon */}
      <div className={styles.statIcon}>{POST_STAT_CARD.icon}</div>

      {/* Content */}
      <div className={styles.statContent}>
        <h3>{POST_STAT_CARD.label}</h3>
        <p className={styles.statValue}>{isLoading ? "..." : total}</p>

        {/* Breakdown Section */}
        {!isLoading && (
          <div className={styles.breakdown}>
            <div className={styles.breakdownItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: POST_STAT_CARD.breakdownColors.published }}
              />
              <span className={styles.breakdownLabel}>
                {POST_STAT_CARD.breakdownLabels.published}:
              </span>
              <span className={styles.breakdownValue}>{published}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: POST_STAT_CARD.breakdownColors.scheduled }}
              />
              <span className={styles.breakdownLabel}>
                {POST_STAT_CARD.breakdownLabels.scheduled}:
              </span>
              <span className={styles.breakdownValue}>{scheduled}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: POST_STAT_CARD.breakdownColors.draft }}
              />
              <span className={styles.breakdownLabel}>
                {POST_STAT_CARD.breakdownLabels.draft}:
              </span>
              <span className={styles.breakdownValue}>{draft}</span>
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

PostStatCard.propTypes = {
  total: PropTypes.number,
  published: PropTypes.number,
  scheduled: PropTypes.number,
  draft: PropTypes.number,
  isLoading: PropTypes.bool,
};
