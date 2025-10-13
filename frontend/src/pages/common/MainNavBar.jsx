//  ========== Component imports  ========== //
import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./MainNavBar.module.css";
import { AuthContext } from "./context/AuthContext.jsx";
import LoginModal from "./auth/LoginModal.jsx";

//  ========== Images imports  ========== //

import OrbisLogo from "../../assets/common/orbislogo.png";

export default function MainNavBar() {

  // ========================= STATE VARIABLES ========================= //

  // --- Modal State ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // --- Dropdown States ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For login/signup
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // ========================= CONTEXT & NAVIGATION ========================= //

  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const navigate = useNavigate();

  // ========================= REFS ========================= //

  // --- Dropdown Refs ---
  const dropdownRef = useRef(null); // Ref for the login/signup dropdown menu
  const profileDropdownRef = useRef(null); // Ref for the profile dropdown

  // ========================= MODAL FUNCTIONS ========================= //

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // ========================= AUTHENTICATION FUNCTIONS ========================= //

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  // ========================= DROPDOWN TOGGLE FUNCTIONS ========================= //

  const toggleLoginDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // ========================= CLICK OUTSIDE HANDLER ========================= //

  // Close dropdown when clicking outside (Login/Signup)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, profileDropdownRef]);

  // Improve the getAvatarUrl function to handle all edge cases
  const getAvatarUrl = (userObj) => {
    // Safely check if user exists and has an avatar property
    if (!userObj || !userObj.avatar) {
      // Return a specific path to a local default avatar image
      return OrbisLogo; // Use an existing image as fallback or specify a different one
    }
    
    // Check if the avatar URL is already absolute (starts with http/https)
    if (userObj.avatar.startsWith('http')) {
      return userObj.avatar;
    }
    
    // Check if avatar is an empty string or null-like value
    if (!userObj.avatar.trim()) {
      return OrbisLogo; // Use fallback image
    }
    
    // Otherwise, prepend the server URL
    return `http://localhost:4000${userObj.avatar}`;
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (

    <div>

      {/* ========================= NAVIGATION BAR ========================= */}
      <nav>
        {/* Orbis Logo */}
        <NavLink to="/">
          <img
            className={styles.orbisLogo}
            src={OrbisLogo}
            alt="Orbis History Maps Logo"
          />
        </NavLink>

        {/* Nav Bar Links */}
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/gallery">GALLERY</NavLink>
        <NavLink to="/shop">SHOP</NavLink>
        <NavLink to="/aboutus">ABOUT US</NavLink>

        {/* ========================= USER NAVIGATION ========================= */}
        {/* =======================SHOPPING AND PROFILE ========================*/}
        
        <div className={styles.userNav}>
          <NavLink to="/shop" className={styles.cartButton}>
            <i className="material-icons">shopping_cart</i> {/* Cart Icon */}
          </NavLink>

          {/* ========================================================= */}
          {/* =================== LOGGED-IN USER UI =================== */}
          {/* ========================================================= */}

                {user ? (
                <div className={styles.profileContainer} ref={profileDropdownRef}>
                  
                  <button
                  onClick={toggleProfileDropdown}
                  className={styles.profileButton}
                  >
                  {/* Use memo to prevent unnecessary re-renders */}
                  <img
                    src={getAvatarUrl(user)}
                    alt="User avatar"
                    className={styles.userAvatar}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite error loops
                      e.target.src = OrbisLogo; // Use an existing image as fallback
                    }}
                  />
                  
                  {/* Use lowercase property names as returned by the API */}
                  <div className={styles.userNickname}>{user.nickname || 'User'}</div>
                  </button>

                  {/* ================= PROFILE DROPDOWN MENU ================= */}
              
              {isProfileDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {/* Use lowercase property names as returned by the API */}
                  <NavLink to={`/profile/${user.id}`}>Edit Profile</NavLink>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* ================= LOGGED-OUT USER UI ==================== */
            /* ========================================================= */

            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                onClick={toggleLoginDropdown}
                className={styles.userButton}
              >
                <i className="material-icons">person</i> {/* User Icon */}
              </button>

              {/* ================= LOGIN/SIGNUP DROPDOWN ================= */}
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={openLoginModal}>Login</button>
                  <NavLink to="/register">Sign Up</NavLink>
                </div>
              )}
              {/* ============== END LOGIN/SIGNUP DROPDOWN =============== */}
            </div>
          )}
        </div>
      </nav>

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </div>
  );
}