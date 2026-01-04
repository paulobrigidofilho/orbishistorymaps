///////////////////////////////////////////////////////////////////////
// ====================== ADMIN DASHBOARD PAGE ======================= //
///////////////////////////////////////////////////////////////////////

// This page displays the admin dashboard with navigation and overview stats

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "./components/AdminLayout";
import StatCard from "./components/StatCard";
import ActionCard from "./components/ActionCard";
import ReviewStatCard from "./components/ReviewStatCard";
import PostStatCard from "./components/PostStatCard";

//  ========== Function imports  ========== //
import fetchStats from "./functions/fetchStats";

//  ========== Constants imports  ========== //
import { STAT_CARDS, ACTION_CARDS } from "./constants/adminConstants";
import { ERROR_MESSAGES } from "./constants/adminErrorMessages";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN DASHBOARD PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminDashboard() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchStats(setStats, setLoading);
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {/* Post Stat Card with breakdown - FIRST */}
          <PostStatCard
            total={stats.totalPosts}
            published={stats.publishedPosts}
            draft={stats.draftPosts}
            isLoading={loading}
          />

          {/* Render first 3 stat cards (Users, Products, Orders) */}
          {STAT_CARDS.slice(0, 3).map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.formatter ? card.formatter(stats[card.key]) : stats[card.key]}
              isLoading={loading}
              to={card.to}
            />
          ))}

          {/* Review Stat Card with breakdown */}
          <ReviewStatCard
            total={stats.totalReviews}
            approved={stats.approvedReviews}
            pending={stats.pendingReviews}
            isLoading={loading}
          />

          {/* Render remaining stat cards (Wishlists, Revenue) */}
          {STAT_CARDS.slice(3).map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.formatter ? card.formatter(stats[card.key]) : stats[card.key]}
              isLoading={loading}
              to={card.to}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionGrid}>
            {ACTION_CARDS.map((card) => (
              <ActionCard
                key={card.to}
                icon={card.icon}
                title={card.title}
                description={card.description}
                to={card.to}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
