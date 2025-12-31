///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component provides a horizontal navigation bar for admin pages
// with profile dropdown and admin-specific navigation options

//  ========== Module imports  ========== //
import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminNavBar.module.css";
// ======= Button/Constants Imports ======= //
import { adminNavBarButtons } from "../constants/adminNavBarConstants";
import NavBarBtn from "../btn/NavBarBtn";
import NavBarProfileBtn from "../btn/NavBarProfileBtn";
//  ========== Images imports  ========== //
import OrbisLogo from "../../../assets/common/orbislogo.png";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN NAVBAR COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function AdminNavBar() {
  return (
    <nav className={styles.adminNavBar}>
      {/* Logo / Brand */}
      <div className={styles.brand}>
        <Link to="/admin" className={styles.brandLink}>
          <span className={styles.brandIcon}>⚙️</span>
          <span className={styles.brandText}>Orbis Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className={styles.navLinks}>
        {adminNavBarButtons
          .filter((btn) => btn.show())
          .map((btn) => (
            <NavBarBtn
              key={btn.key}
              to={btn.to}
              icon={btn.icon}
              label={btn.label}
              exact={btn.exact}
            />
          ))}
      </div>

      {/* Right Section - Shop Link & Profile */}
      <div className={styles.rightSection}>
        {/* Home Link */}
        <Link to="/" className={styles.shopLink}>
          <span className={styles.navIcon}>🏠</span>
          Home
        </Link>
        {/* Profile Dropdown */}
        <NavBarProfileBtn />
      </div>
    </nav>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN NAVBAR COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////
