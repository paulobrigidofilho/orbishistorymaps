///////////////////////////////////////////////////////////////////////
// =================== PRICE DISPLAY COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// Reusable component for displaying prices with NZD currency label
// Shows "NZD $X.XX" format for New Zealand Dollar

import React from "react";
import styles from "./PriceDisplay.module.css";

///////////////////////////////////////////////////////////////////////
// ===================== COMPONENT DEFINITION ======================= //
///////////////////////////////////////////////////////////////////////

/**
 * PriceDisplay - Displays a price with NZD currency label
 *
 * @param {number|string} price - The price value
 * @param {number|string} salePrice - Optional sale price (if product is on sale)
 * @param {boolean} showCurrency - Whether to show NZD label (default: true)
 * @param {string} size - Size variant: "small", "medium", "large" (default: "medium")
 * @param {string} className - Additional CSS classes
 */
export default function PriceDisplay({
  price,
  salePrice,
  showCurrency = true,
  size = "medium",
  className = "",
}) {
  const numPrice = parseFloat(price) || 0;
  const numSalePrice = salePrice ? parseFloat(salePrice) : null;
  const hasDiscount = numSalePrice && numSalePrice < numPrice;

  return (
    <div className={`${styles.priceDisplay} ${styles[size]} ${className}`}>
      {showCurrency && (
        <span className={styles.currencyLabel}>NZD</span>
      )}
      <div className={styles.priceValues}>
        {hasDiscount ? (
          <>
            <span className={styles.originalPrice}>
              ${numPrice.toFixed(2)}
            </span>
            <span className={styles.salePrice}>
              ${numSalePrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span className={styles.currentPrice}>
            ${numPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}