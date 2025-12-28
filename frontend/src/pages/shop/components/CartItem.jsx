///////////////////////////////////////////////////////////////////////
// ======================== CART ITEM COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// This component displays a single item in the shopping cart

//  ========== Module imports  ========== //
import React from "react";
import { Link } from "react-router-dom";
import styles from "./CartItem.module.css";

//  ========== Function imports  ========== //
import { calculateItemSubtotal } from "../functions/calculateCartTotal";

// Default product image path
const DEFAULT_PRODUCT_IMAGE = "/assets/common/default-product-img.png";

///////////////////////////////////////////////////////////////////////
// ========================= CART ITEM =============================== //
///////////////////////////////////////////////////////////////////////

const CartItem = ({ item, onUpdateQuantity, onRemove, updating }) => {
  const subtotal = calculateItemSubtotal(item);
  const maxStock = item.quantity_available || 0;

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      onUpdateQuantity(item.cart_item_id, newQuantity);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.cartItem}>
      {/* Product Image */}
      <Link to={`/shop/product/${item.product_slug}`} className={styles.imageLink}>
        <img
          src={item.primary_image || DEFAULT_PRODUCT_IMAGE}
          alt={item.product_name}
          className={styles.productImage}
          onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
        />
      </Link>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <Link to={`/shop/product/${item.product_slug}`} className={styles.productLink}>
          <h3 className={styles.productName}>{item.product_name}</h3>
        </Link>
        {item.sku && <p className={styles.sku}>SKU: {item.sku}</p>}
        <p className={styles.price}>${parseFloat(item.price_at_addition).toFixed(2)}</p>
        
        {/* Stock warning */}
        {maxStock < 10 && maxStock > 0 && (
          <p className={styles.lowStock}>Only {maxStock} left in stock</p>
        )}
        {maxStock === 0 && (
          <p className={styles.outOfStock}>Out of stock</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className={styles.quantitySection}>
        <div className={styles.quantityControls}>
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1 || updating}
            className={styles.quantityButton}
          >
            −
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={item.quantity >= maxStock || updating}
            className={styles.quantityButton}
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className={styles.subtotalSection}>
        <p className={styles.subtotal}>${subtotal.toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.cart_item_id)}
        disabled={updating}
        className={styles.removeButton}
        title="Remove item"
      >
        <i className="material-icons">delete</i>
      </button>
    </div>
  );
};

export default CartItem;
