///////////////////////////////////////////////////////////////////////
// ====================== STAT CARD COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component displays a single stat card with icon, label, and value

//  ========== Module imports  ========== //
import React from "react";
import { Link } from "react-router-dom";
import styles from "./StatCard.module.css";

///////////////////////////////////////////////////////////////////////
// ======================= STAT CARD COMPONENT ======================= //
///////////////////////////////////////////////////////////////////////

export default function StatCard({ icon, label, value, isLoading = false, to }) {
  const content = (
    <>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <h3>{label}</h3>
        <p className={styles.statValue}>{isLoading ? "..." : value}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.statCard} ${styles.clickable}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={styles.statCard}>
      {content}
    </div>
  );
}
