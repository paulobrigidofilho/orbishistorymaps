///////////////////////////////////////
// ===== CART BUTTON COMPONENT ===== //
///////////////////////////////////////

// This component renders the shopping cart button in the navigation bar

//  ========== Module imports  ========== //
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "../MainNavBar.module.css";
import { getCart } from "../../../pages/shop/services/cartService";

const CartBtn = () => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [itemCount, setItemCount] = useState(0);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch cart data on mount and set up periodic refresh
  useEffect(() => {
    fetchCartCount();

    // Refresh cart count every 5 seconds
    const interval = setInterval(fetchCartCount, 5000);

    // Listen for cart update events
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const count = response.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setItemCount(count);
    } catch (error) {
      // Silently fail - user might not be logged in or cart might be empty
      setItemCount(0);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <NavLink to="/cart" className={styles.cartButton}>
      <i className="material-icons">shopping_cart</i>
      {itemCount > 0 && (
        <span className={styles.cartBadge}>{itemCount}</span>
      )}
    </NavLink>
  );
};

export default CartBtn;
