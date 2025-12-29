///////////////////////////////////////////////////////////////////////
// ================= WISHLIST BUTTON COMPONENT ======================= //
///////////////////////////////////////////////////////////////////////

// This component renders the wishlist navigation button in the navigation bar
// Shows a badge with the count of items in the wishlist

//  ========== Module imports  ========== //
import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import styles from "../MainNavBar.module.css";

//  ========== Function imports  ========== //
import getUserWishlist from "../wishlist/functions/getUserWishlist";

//  ========== Context imports  ========== //
import { AuthContext } from "../context/AuthContext";

///////////////////////////////////////////////////////////////////////
// =================== WISHLIST BUTTON =============================== //
///////////////////////////////////////////////////////////////////////

const WishlistBtn = () => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const { user } = useContext(AuthContext);
  const [itemCount, setItemCount] = useState(0);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch wishlist data on mount and when user changes
  useEffect(() => {
    if (!user) {
      setItemCount(0);
      return;
    }

    fetchWishlistCount();

    // Refresh wishlist count every 10 seconds
    const interval = setInterval(fetchWishlistCount, 10000);

    // Listen for wishlist update events
    const handleWishlistUpdate = () => fetchWishlistCount();
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [user]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchWishlistCount = async () => {
    try {
      const response = await getUserWishlist();
      const count = response.data?.length || 0;
      setItemCount(count);
    } catch (error) {
      // Silently fail - user might not be logged in
      setItemCount(0);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <NavLink to="/wishlist" className={styles.wishlistButton}>
      <i className="material-icons">favorite</i>
      {itemCount > 0 && (
        <span className={styles.wishlistBadge}>{itemCount}</span>
      )}
    </NavLink>
  );
};

export default WishlistBtn;
