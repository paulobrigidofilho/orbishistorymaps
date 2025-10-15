///////////////////////////////////
// ===== PROFILE BUTTON COMPONENT ===== //
///////////////////////////////////

// This component handles user authentication UI elements including
// profile display, login/signup options, and related dropdowns

import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../MainNavBar.module.css";
import { AuthContext } from "../context/AuthContext.jsx";
import LoginModal from "../auth/LoginModal.jsx";
import OrbisLogo from "../../../assets/common/orbislogo.png"; // Adjust path as needed

const ProfileBtn = () => {
  // ========================= STATE VARIABLES ========================= //
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // ========================= CONTEXT & NAVIGATION ========================= //
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ========================= REFS ========================= //
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // ========================= MODAL FUNCTIONS ========================= //
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // ========================= AUTHENTICATION FUNCTIONS ========================= //
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ========================= DROPDOWN TOGGLE FUNCTIONS ========================= //
  const toggleLoginDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // ========================= CLICK OUTSIDE HANDLER ========================= //
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, profileDropdownRef]);

  // ========================= HELPER FUNCTIONS ========================= //
  const getAvatarUrl = (userObj) => {
    if (!userObj || !userObj.avatar) {
      return OrbisLogo;
    }
    
    if (userObj.avatar.startsWith('http')) {
      return userObj.avatar;
    }
    
    if (!userObj.avatar.trim()) {
      return OrbisLogo;
    }
    
    return `${process.env.REACT_APP_API_URL}${userObj.avatar}`;
  };

  return (
    <>
      {user ? (
        <div className={styles.profileContainer} ref={profileDropdownRef}>
          <button onClick={toggleProfileDropdown} className={styles.profileButton}>
            <img
              src={getAvatarUrl(user)}
              alt="User avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = OrbisLogo;
              }}
            />
            <div className={styles.userNickname}>{user.nickname || 'User'}</div>
          </button>

          {isProfileDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <NavLink to={`/profile/${user.id}`}>Edit Profile</NavLink>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button onClick={toggleLoginDropdown} className={styles.userButton}>
            <i className="material-icons">person</i>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={openLoginModal}>Login</button>
              <NavLink to="/register">Sign Up</NavLink>
            </div>
          )}
        </div>
      )}
      
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
    </>
  );
};

export default ProfileBtn;
