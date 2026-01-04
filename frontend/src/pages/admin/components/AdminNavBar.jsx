///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component provides a horizontal navigation bar for admin pages
// with profile dropdown and admin-specific navigation options

//  ========== Module imports  ========== //

import styles from "./AdminNavBar.module.css";
// ======= Button/Constants Imports ======= //

import { adminNavBarButtons } from "../constants/adminNavBarConstants";
import NavBarBtn from "../btn/NavBarBtn";
import NavBarProfileBtn from "../btn/NavBarProfileBtn";

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN NAVBAR COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function AdminNavBar() {
  return (
    <nav className={styles.adminNavBar}>
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

      {/* Right Section - Profile */}
      <div className={styles.rightSection}>
        {/* Profile Dropdown */}
        <NavBarProfileBtn />
      </div>
    </nav>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN NAVBAR COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////
