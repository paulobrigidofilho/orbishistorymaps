///////////////////////////////////////////////////////////////////////
// =================== ADMIN NAVBAR PROFILE BUTTON ================== //
///////////////////////////////////////////////////////////////////////

// This component renders the profile button with dropdown for admin nav bar

import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/context/AuthContext";
import styles from "../components/AdminNavBar.module.css";
import OrbisLogo from "../../../assets/common/orbislogo.png";

///////////////////////////////////////////////////////////////////////
// =================== NAVBAR PROFILE BUTTON COMPONENT ============== //
///////////////////////////////////////////////////////////////////////

export default function NavBarProfileBtn() {
  const { user, logout } = useContext(AuthContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get the correct avatar URL or fallback to default logo
  const getAvatarUrl = (userObj) => {
    if (!userObj || !userObj.avatar) return OrbisLogo;
    if (typeof userObj.avatar === "string" && userObj.avatar.startsWith("http")) return userObj.avatar;
    if (!userObj.avatar || (typeof userObj.avatar === "string" && !userObj.avatar.trim())) return OrbisLogo;
    return userObj.avatar;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((open) => !open);
  };

  return (
    <div className={styles.profileContainer} ref={profileDropdownRef}>
      <button onClick={toggleProfileDropdown} className={styles.profileButton}>
        <img
          src={getAvatarUrl(user)}
          alt="Admin avatar"
          className={styles.userAvatar}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = OrbisLogo;
          }}
        />
        <span className={styles.userName}>{user?.first_name || user?.firstName || "Admin"}</span>
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
          <button onClick={handleLogout} className={styles.dropdownItem}>
            <span className={styles.dropdownIcon}>🚪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN NAVBAR PROFILE BUTTON ============== //
///////////////////////////////////////////////////////////////////////
