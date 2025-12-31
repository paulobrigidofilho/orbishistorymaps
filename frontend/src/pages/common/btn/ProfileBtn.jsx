//////////////////////////////////////////
// ===== PROFILE BUTTON COMPONENT ===== //
//////////////////////////////////////////

// This component handles user authentication UI elements including
// profile display, login/signup options, and related dropdowns

// =========== Module imports  ========== //
import styles from "../MainNavBar.module.css";
import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// =========== Component imports  ========== //
import LoginModal from "../auth/LoginModal.jsx";

// =========== Function imports  ========== //
import getCart from "../../shop/functions/cartService/getCart";

// =========== Asset imports  ========== //
import OrbisLogo from "../../../assets/common/orbislogo.png";

// ======= Constants ======= //
// Using OrbisLogo as default; alternatively import DEFAULT_AVATAR from authConstants
const DEFAULT_AVATAR = OrbisLogo;

const ProfileBtn = () => {
  // ========================= STATE VARIABLES ========================= //
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // ========================= FETCH CART COUNT ========================= //
  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const response = await getCart();
        const count = response.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (error) {
        setCartCount(0);
      }
    };

    fetchCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  // ========================= CLICK OUTSIDE HANDLER ========================= //
  // Close dropdowns when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, profileDropdownRef]);

  // ========================= HELPER FUNCTIONS ========================= //
  // Get the correct avatar URL or fallback to default logo
  const getAvatarUrl = (userObj) => {
    if (!userObj || !userObj.avatar) {
      return DEFAULT_AVATAR;
    }

    // If it's already an absolute URL, return it
    if (typeof userObj.avatar === 'string' && userObj.avatar.startsWith("http")) {
      return userObj.avatar;
    }

    // If it's an empty or whitespace-only string, return fallback
    if (!userObj.avatar || (typeof userObj.avatar === 'string' && !userObj.avatar.trim())) {
      return DEFAULT_AVATAR;
    }

    // Otherwise assume it's a relative path served by the backend (e.g., /uploads/avatars/...)
    // Return as-is so the browser will request same-origin /uploads/avatars/...
    return userObj.avatar;
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <>
      {user ? (
        <div className={styles.profileContainer} ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className={styles.profileButton}
          >
            <img
              src={getAvatarUrl(user)}
              alt="User avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = OrbisLogo;
              }}
            />
            <div className={styles.userNickname}>{user.nickname || "User"}</div>
          </button>

          {isProfileDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {user.role === "admin" && (
                <NavLink to="/admin">Admin Dashboard</NavLink>
              )}
              <NavLink to={`/profile/${user.id}`}>Edit Profile</NavLink>
              <NavLink to="/wishlist">
                <i className="material-icons">favorite</i> Wishlist
              </NavLink>
              <NavLink to="/cart">
                <i className="material-icons">shopping_cart</i> Cart {cartCount > 0 && `(${cartCount})`}
              </NavLink>
              <NavLink to="/my-orders">
                <i className="material-icons">receipt_long</i> Orders
              </NavLink>
              <NavLink to="/my-reviews">
                <i className="material-icons">rate_review</i> Reviews
              </NavLink>
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
