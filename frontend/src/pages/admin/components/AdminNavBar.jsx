///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR COMPONENT ======================== //
///////////////////////////////////////////////////////////////////////

// This component provides a horizontal navigation bar for admin pages
// with profile dropdown and admin-specific navigation options

//  ========== Module imports  ========== //
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/context/AuthContext";
import styles from "./AdminNavBar.module.css";

//  ========== Images imports  ========== //
import OrbisLogo from "../../../assets/common/orbislogo.png";

// ======= Default Avatar ======= //
const DEFAULT_AVATAR = OrbisLogo;

///////////////////////////////////////////////////////////////////////
// ===================== ADMIN NAVBAR COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

export default function AdminNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Get the correct avatar URL or fallback to default logo
  const getAvatarUrl = (userObj) => {
    if (!userObj || !userObj.avatar) {
      return DEFAULT_AVATAR;
    }

    // If it's already an absolute URL, return it
    if (typeof userObj.avatar === "string" && userObj.avatar.startsWith("http")) {
      return userObj.avatar;
    }

    // If it's an empty or whitespace-only string, return fallback
    if (!userObj.avatar || (typeof userObj.avatar === "string" && !userObj.avatar.trim())) {
      return DEFAULT_AVATAR;
    }

    // Otherwise assume it's a relative path served by the backend
    return userObj.avatar;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

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
        <NavLink
          to="/admin"
          className={`${styles.navLink} ${isActive("/admin") && location.pathname === "/admin" ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={`${styles.navLink} ${isActive("/admin/users") ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>👥</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/products"
          className={`${styles.navLink} ${isActive("/admin/products") ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>📦</span>
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={`${styles.navLink} ${isActive("/admin/orders") ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>🛒</span>
          Orders
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={`${styles.navLink} ${isActive("/admin/settings") ? styles.active : ""}`}
        >
          <span className={styles.navIcon}>⚙️</span>
          Settings
        </NavLink>
      </div>

      {/* Right Section - Shop Link & Profile */}
      <div className={styles.rightSection}>
        {/* Home Link */}
        <Link to="/" className={styles.shopLink}>
          <span className={styles.navIcon}>🏠</span>
          Home
        </Link>

        {/* Profile Dropdown */}
        <div className={styles.profileContainer} ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className={styles.profileButton}
          >
            <img
              src={getAvatarUrl(user)}
              alt="Admin avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = OrbisLogo;
              }}
            />
            <span className={styles.userName}>
              {user?.first_name || user?.firstName || "Admin"}
            </span>
            <span className={styles.dropdownArrow}>▼</span>
          </button>

          {isProfileDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <img
                  src={getAvatarUrl(user)}
                  alt="Admin avatar"
                  className={styles.dropdownAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = OrbisLogo;
                  }}
                />
                <div className={styles.dropdownUserInfo}>
                  <span className={styles.dropdownUserName}>
                    {user?.first_name || user?.firstName} {user?.last_name || user?.lastName}
                  </span>
                  <span className={styles.dropdownUserRole}>Administrator</span>
                </div>
              </div>
              <div className={styles.dropdownDivider}></div>
              <NavLink
                to={`/profile/${user?.id}`}
                className={styles.dropdownItem}
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <span className={styles.dropdownIcon}>👤</span>
                Profile
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={styles.dropdownItem}
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <span className={styles.dropdownIcon}>⚙️</span>
                Settings
              </NavLink>
              <div className={styles.dropdownDivider}></div>
              <button
                onClick={handleLogout}
                className={styles.dropdownItem}
              >
                <span className={styles.dropdownIcon}>🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
