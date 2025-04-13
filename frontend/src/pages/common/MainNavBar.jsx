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
                <img
                  src={user.USER_AVATAR} 
                  alt="User Avatar"
                  className={styles.userAvatar}
                />
                
                <div className={styles.userNickname}>{user.USER_NICKNAME}</div>
              </button>

              {/* ================= PROFILE DROPDOWN MENU ================= */}
              
              {isProfileDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <NavLink to={`/profile/${user.USER_ID}`}>Edit Profile</NavLink>
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