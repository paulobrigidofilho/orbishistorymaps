///////////////////////////////////////////////////////////////////////
// =================== QUANTITY SELECTOR COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// This reusable component displays quantity +/- controls

//  ========== Module imports  ========== //
import React from "react";
import styles from "./QuantitySelector.module.css";

///////////////////////////////////////////////////////////////////////
// ===================== QUANTITY SELECTOR =========================== //
///////////////////////////////////////////////////////////////////////

/**
 * Reusable quantity selector with +/- buttons
 * @param {number} quantity - Current quantity value
 * @param {Function} onDecrease - Callback for decrease button
 * @param {Function} onIncrease - Callback for increase button
 * @param {boolean} disableDecrease - Disable decrease button
 * @param {boolean} disableIncrease - Disable increase button
 * @param {boolean} disabled - Disable both buttons (e.g., during update)
 * @param {string} size - Size variant: 'small' | 'medium' | 'large' (default: 'medium')
 */
const QuantitySelector = ({
  quantity,
  onDecrease,
  onIncrease,
  disableDecrease = false,
  disableIncrease = false,
  disabled = false,
  size = "medium",
}) => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={`${styles.quantitySelector} ${styles[size]}`}>
      <button
        onClick={onDecrease}
        disabled={disableDecrease || disabled}
        className={styles.quantityButton}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.quantityDisplay}>{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={disableIncrease || disabled}
        className={styles.quantityButton}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
