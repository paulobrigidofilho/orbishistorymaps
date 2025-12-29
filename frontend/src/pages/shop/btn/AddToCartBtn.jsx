///////////////////////////////////////////////////////////////////////
// ==================== ADD TO CART BUTTON COMPONENT ================= //
///////////////////////////////////////////////////////////////////////

// This reusable component displays an Add to Cart button with optional states

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AddToCartBtn.module.css";

///////////////////////////////////////////////////////////////////////
// ======================== ADD TO CART BTN ========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Reusable Add to Cart button with loading and in-cart states
 * @param {Function} onClick - Callback for button click
 * @param {boolean} loading - Show loading state
 * @param {boolean} isInCart - Show "Already in Cart" state
 * @param {boolean} disabled - Disable the button
 * @param {boolean} showIcon - Show cart icon (default: true)
 * @param {string} size - Size variant: 'small' | 'medium' | 'large' (default: 'medium')
 * @param {string} variant - Style variant: 'primary' | 'secondary' (default: 'primary')
 * @param {string} className - Additional CSS class
 */
const AddToCartBtn = ({
  onClick,
  loading = false,
  isInCart = false,
  disabled = false,
  showIcon = true,
  size = "medium",
  variant = "primary",
  className = "",
}) => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get button content based on state
  const getButtonContent = () => {
    if (loading) {
      return "Adding...";
    }

    if (isInCart) {
      return (
        <>
          {showIcon && <i className="material-icons">check_circle</i>}
          Already in Cart
        </>
      );
    }

    return (
      <>
        {showIcon && <i className="material-icons">add_shopping_cart</i>}
        Add to Cart
      </>
    );
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${styles.addToCartBtn} 
        ${styles[size]} 
        ${styles[variant]}
        ${isInCart ? styles.inCart : ""} 
        ${className}
      `.trim()}
    >
      {getButtonContent()}
    </button>
  );
};

export default AddToCartBtn;
