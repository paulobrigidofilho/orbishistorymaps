///////////////////////////////////////////////////////////////////////
// =================== ADMIN LAYOUT COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component provides the admin layout with sidebar navigation

//  ========== Module imports  ========== //
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/context/AuthContext";
import styles from "./AdminLayout.module.css";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN LAYOUT COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className={styles.unauthorized}>
        <h1>Unauthorized Access</h1>
        <p>You need admin privileges to access this page.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Orbis Admin</h2>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/admin"
            className={`${styles.navLink} ${isActive("/admin") && !location.pathname.includes("/admin/") ? styles.active : ""}`}
          >
            <span className={styles.icon}>📊</span>
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className={`${styles.navLink} ${isActive("/admin/users") ? styles.active : ""}`}
          >
            <span className={styles.icon}>👥</span>
            Users
          </Link>

          <Link
            to="/admin/products"
            className={`${styles.navLink} ${isActive("/admin/products") ? styles.active : ""}`}
          >
            <span className={styles.icon}>📦</span>
            Products
          </Link>

          <Link
            to="/admin/orders"
            className={`${styles.navLink} ${isActive("/admin/orders") ? styles.active : ""}`}
          >
            <span className={styles.icon}>🛒</span>
            Orders
          </Link>

          <Link
            to="/admin/settings"
            className={`${styles.navLink} ${isActive("/admin/settings") ? styles.active : ""}`}
          >
            <span className={styles.icon}>⚙️</span>
            Settings
          </Link>

          <div className={styles.divider}></div>

          <Link to="/" className={styles.navLink}>
            <span className={styles.icon}>🏠</span>
            Back to Shop
          </Link>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.icon}>🚪</span>
            Logout
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.first_name} />
              ) : (
                <span>{user.first_name?.[0]}</span>
              )}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>
                {user.first_name} {user.last_name}
              </p>
              <p className={styles.userRole}>Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
