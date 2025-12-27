///////////////////////////////////////////////////////////////////////
// =================== ACTION CARD COMPONENT ========================= //
///////////////////////////////////////////////////////////////////////

// Reusable action card component for admin dashboard quick actions

//  ========== Module imports  ========== //
import React from "react";
import { Link } from "react-router-dom";
import styles from "./ActionCard.module.css";

///////////////////////////////////////////////////////////////////////
// ===================== ACTION CARD COMPONENT ======================= //
///////////////////////////////////////////////////////////////////////

export default function ActionCard({ icon, title, description, to }) {
  return (
    <Link to={to} className={styles.actionCard}>
      <span className={styles.actionIcon}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}
