//  ========== Component imports  ========== //

import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./MainNavBar.module.css";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import LoginModal from "../../auth/LoginModal"; // Import LoginModal component

//  ========== Images imports  ========== //

import OrbisLogo from "../../assets/common/orbislogo.png";

///////////////////////////////////////////////////////////////////////
// ========================= JSX BELOW ============================= //
///////////////////////////////////////////////////////////////////////

export default function MainNavBar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div>
      <nav>
        {/* Orbis Logo */}
        <NavLink to="/">
          <img src={OrbisLogo} alt="Orbis History Maps Logo" />
        </NavLink>

        {/* Nav Bar Links */}
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/gallery">GALLERY</NavLink>
        <NavLink to="/shop">SHOP</NavLink>
        <NavLink to="/aboutus">ABOUT US</NavLink>

        {/* Cart and User Profile Buttons */}
        {/* SHOPPING AND PROFILE */}
        <div className={styles.userNav}>
          <NavLink to="/shop" className={styles.cartButton}>
            <i className="material-icons">shopping_cart</i> {/* Cart Icon */}
          </NavLink>
          {user ? (
            <>
              <span>Welcome, {user.nickname}</span> {/* Display user nickname */}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button onClick={toggleDropdown} className={styles.userButton}>
                <i className="material-icons">person</i> {/* User Icon */}
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={openLoginModal}>Login</button>
                  <NavLink to="/register">Sign Up</NavLink>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </div>
  );
}