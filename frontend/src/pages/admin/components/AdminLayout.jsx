///////////////////////////////////////////////////////////////////////
// =================== ADMIN LAYOUT COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component provides the admin layout with top navigation bar

//  ========== Module imports  ========== //
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../common/context/AuthContext";
import styles from "./AdminLayout.module.css";

//  ========== Component imports  ========== //
import AdminNavBar from "./AdminNavBar";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN LAYOUT COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function AdminLayout({ children }) {
  const { user } = useContext(AuthContext);

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
      {/* Top Navigation Bar */}
      <AdminNavBar />

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
