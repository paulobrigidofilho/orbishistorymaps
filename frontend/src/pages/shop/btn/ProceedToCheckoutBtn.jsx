///////////////////////////////////////////////////////////////////////
// ================ PROCEED TO CHECKOUT BUTTON COMPONENT ============= //
///////////////////////////////////////////////////////////////////////

// This reusable component displays a Proceed to Checkout button

//  ========== Module imports  ========== //
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProceedToCheckoutBtn.module.css";

//  ========== Component imports  ========== //
import LoginModal from "../../common/auth/LoginModal";

//  ========== Context imports  ========== //
import { AuthContext } from "../../common/context/AuthContext";

///////////////////////////////////////////////////////////////////////
// =================== PROCEED TO CHECKOUT BTN ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * Reusable Proceed to Checkout button
 * @param {boolean} show - Whether to show the button
 * @param {boolean} showIcon - Show cart icon (default: true)
 * @param {string} size - Size variant: 'small' | 'medium' | 'large' (default: 'medium')
 * @param {string} className - Additional CSS class
 */
const ProceedToCheckoutBtn = ({
  show = false,
  showIcon = true,
  size = "medium",
  className = "",
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (user) {
      // User is logged in, go to cart
      navigate("/cart");
    } else {
      // Guest user - show login modal
      setShowLoginModal(true);
    }
  };

  // Close login modal
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  if (!show) return null;

  return (
    <>
      <button
        onClick={handleProceedToCheckout}
        className={`${styles.proceedBtn} ${styles[size]} ${className}`.trim()}
      >
        {showIcon && <i className="material-icons">shopping_cart_checkout</i>}
        Proceed to Checkout
      </button>

      {/* Login Modal for guest users */}
      {showLoginModal && <LoginModal onClose={handleCloseLoginModal} />}
    </>
  );
};

export default ProceedToCheckoutBtn;
