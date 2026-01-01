///////////////////////////////////////////////////////////////////////
// ======================== WISHLIST PAGE ============================ //
///////////////////////////////////////////////////////////////////////

// This page displays the user's wishlist with options to remove items
// or add them to cart

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WishlistPage.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../MainNavBar";
import WishlistItem from "./components/WishlistItem";
import LoginRequired from "../components/LoginRequired";
import LoginModal from "../auth/LoginModal";

//  ========== Function imports  ========== //
import getUserWishlist from "./functions/getUserWishlist";
import removeFromWishlist from "./functions/removeFromWishlist";

//  ========== Context imports  ========== //
import { AuthContext } from "../context/AuthContext";

//  ========== Constants imports  ========== //
import {
  WISHLIST_SUCCESS_MESSAGES,
  WISHLIST_ERROR_MESSAGES,
} from "./constants/wishlistConstants";

///////////////////////////////////////////////////////////////////////
// ========================= WISHLIST PAGE =========================== //
///////////////////////////////////////////////////////////////////////

export default function WishlistPage() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [wishlistData, setWishlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch wishlist on component mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadWishlist();
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Fetch wishlist data
  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserWishlist();
      setWishlistData(response.data || []);
    } catch (err) {
      setError(err.message || WISHLIST_ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true);
      await removeFromWishlist(productId);
      showMessage(WISHLIST_SUCCESS_MESSAGES.ITEM_REMOVED, "success");
      await loadWishlist();
      
      // Dispatch wishlist update event for WishlistBtn
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      showMessage(err.message || WISHLIST_ERROR_MESSAGES.REMOVE_FAILED, "error");
    } finally {
      setUpdating(false);
    }
  };

  // Show message with auto-dismiss
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Calculate item count
  const itemCount = wishlistData?.length || 0;

  ///////////////////////////////////////////////////////////////////////
  // ========================= NOT LOGGED IN STATE =================== //
  ///////////////////////////////////////////////////////////////////////

  if (!user) {
    return (
      <div className={styles.wishlistPage}>
        <MainNavBar />
        <LoginRequired
          icon="favorite_border"
          title="Please Log In"
          message="You need to be logged in to view your wishlist."
          iconColor="#e74c3c"
          onLoginClick={() => setShowLoginModal(true)}
        />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.wishlistPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.wishlistPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <h2>Error Loading Wishlist</h2>
          <p>{error}</p>
          <button onClick={loadWishlist} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= EMPTY WISHLIST STATE ================== //
  ///////////////////////////////////////////////////////////////////////

  if (!wishlistData || itemCount === 0) {
    return (
      <div className={styles.wishlistPage}>
        <MainNavBar />
        <div className={styles.emptyWishlistContainer}>
          <i className="material-icons" style={{ fontSize: "4rem", color: "#e74c3c" }}>
            favorite_border
          </i>
          <h2>Your Wishlist is Empty</h2>
          <p>Save items you love to your wishlist!</p>
          <button onClick={() => navigate("/shop")} className={styles.shopButton}>
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.wishlistPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Wishlist Container */}
      <div className={styles.wishlistContainer}>
        {/* Page Header */}
        <div className={styles.wishlistHeader}>
          <h1>
            <i className="material-icons" style={{ color: "#e74c3c", verticalAlign: "middle", marginRight: "0.5rem" }}>
              favorite
            </i>
            My Wishlist
          </h1>
          <p>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Wishlist Items Grid */}
        <div className={styles.wishlistContent}>
          <div className={styles.wishlistItems}>
            {wishlistData.map((item) => (
              <WishlistItem
                key={item.wishlist_id}
                item={item}
                onRemove={handleRemoveItem}
                updating={updating}
              />
            ))}
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className={styles.actionsContainer}>
          <button
            onClick={() => navigate("/shop")}
            className={styles.continueShoppingButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
