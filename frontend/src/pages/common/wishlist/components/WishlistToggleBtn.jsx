///////////////////////////////////////////////////////////////////////
// ================ WISHLIST TOGGLE BUTTON COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This component renders a heart-shaped toggle button for wishlist
// Used on product cards and product detail pages to add/remove from wishlist

//  ========== Module imports  ========== //
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import styles from "./WishlistToggleBtn.module.css";

//  ========== Function imports  ========== //
import addToWishlist from "../functions/addToWishlist";
import removeFromWishlist from "../functions/removeFromWishlist";
import getUserWishlist from "../functions/getUserWishlist";

//  ========== Constants imports  ========== //
import { WISHLIST_SUCCESS_MESSAGES, WISHLIST_ERROR_MESSAGES } from "../constants/wishlistConstants";

//  ========== Context imports  ========== //
import { AuthContext } from "../../context/AuthContext";

///////////////////////////////////////////////////////////////////////
// ================ WISHLIST TOGGLE BUTTON =========================== //
///////////////////////////////////////////////////////////////////////

const WishlistToggleBtn = ({ productId, onStatusChange }) => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const { user } = useContext(AuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Check if product is in wishlist on mount (only if user is logged in)
  useEffect(() => {
    if (!user) {
      setIsInWishlist(false);
      return;
    }

    const checkWishlistStatus = async () => {
      try {
        const response = await getUserWishlist();
        const wishlistItems = response.data || [];
        const inWishlist = wishlistItems.some(item => item.product_id === productId);
        setIsInWishlist(inWishlist);
      } catch (error) {
        // Silently fail - user might not have access to wishlist
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [user, productId]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= NOTIFICATION HANDLER ================== //
  ///////////////////////////////////////////////////////////////////////

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setIsFadingOut(false);

    // Start fade out after 2 seconds
    setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Remove notification after fade completes
    setTimeout(() => {
      setNotification(null);
      setIsFadingOut(false);
    }, 2500);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= EVENT HANDLERS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Prevent event bubbling

    if (!user) {
      showNotification("error", "Please login to use wishlist");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(productId);
        setIsInWishlist(false);
        showNotification("success", "Removed from Wishlist");
        
        // Dispatch wishlist update event immediately
        window.dispatchEvent(new Event("wishlistUpdated"));
        
        // Notify parent component if callback provided
        if (onStatusChange) {
          onStatusChange(false);
        }
      } else {
        // Add to wishlist
        await addToWishlist(productId);
        setIsInWishlist(true);
        showNotification("success", "Added to Wishlist");
        
        // Dispatch wishlist update event immediately
        window.dispatchEvent(new Event("wishlistUpdated"));
        
        // Notify parent component if callback provided
        if (onStatusChange) {
          onStatusChange(true);
        }
      }
    } catch (error) {
      const errorMessage = error.message || 
        (isInWishlist ? WISHLIST_ERROR_MESSAGES.REMOVE_FAILED : WISHLIST_ERROR_MESSAGES.ADD_FAILED);
      
      showNotification("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.wishlistToggleBtnContainer}>
      <button
        onClick={handleToggleWishlist}
        className={`${styles.wishlistToggleBtn} ${isInWishlist ? styles.active : ""} ${isLoading ? styles.loading : ""}`}
        disabled={isLoading}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <i className="material-icons">
          {isInWishlist ? "favorite" : "favorite_border"}
        </i>
      </button>

      {/* Notification Popup */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]} ${isFadingOut ? styles.fadeOut : ""}`}>
          <i className="material-icons">
            {notification.type === "success" ? (isInWishlist ? "favorite" : "favorite_border") : "error"}
          </i>
          <span>{notification.text}</span>
        </div>
      )}
    </div>
  );
};

///////////////////////////////////////////////////////////////////////
// ========================= PROP TYPES ============================ //
///////////////////////////////////////////////////////////////////////

WishlistToggleBtn.propTypes = {
  productId: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func, // Optional callback when wishlist status changes
};

export default WishlistToggleBtn;
