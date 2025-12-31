///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR BUTTON COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

// This component renders a single admin nav bar button using props/config

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../components/AdminNavBar.module.css";

///////////////////////////////////////////////////////////////////////
// =================== NAVBAR BUTTON COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function NavBarBtn({ to, icon, label, exact, isActive }) {
  const location = useLocation();
  // Determine if the button is active
  const active = isActive
    ? isActive(to, location)
    : exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`${styles.navLink} ${active ? styles.active : ""}`}
      end={!!exact}
    >
      <span className={styles.navIcon}>{icon}</span>
      {label}
    </NavLink>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN NAVBAR BUTTON COMPONENT ============ //
///////////////////////////////////////////////////////////////////////
