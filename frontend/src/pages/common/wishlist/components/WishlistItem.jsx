///////////////////////////////////////////////////////////////////////
// ==================== WISHLIST ITEM COMPONENT ====================== //
///////////////////////////////////////////////////////////////////////

// This component displays a single item in the wishlist

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./WishlistItem.module.css";

//  ========== Component imports  ========== //
import AddToCartBtn from "../../../shop/btn/AddToCartBtn";
import FadeNotification from "../../components/FadeNotification";

//  ========== Function imports  ========== //
import addToCart from "../../../shop/functions/cartService/addToCart";
import getCart from "../../../shop/functions/cartService/getCart";

// Default product image path
const DEFAULT_PRODUCT_IMAGE = "/assets/common/default-product-img.png";

///////////////////////////////////////////////////////////////////////
// ========================= WISHLIST ITEM =========================== //
///////////////////////////////////////////////////////////////////////

const WishlistItem = ({ item, onRemove, updating }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [notification, setNotification] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Check if product is already in cart
  useEffect(() => {
    checkCartStatus();

    // Listen for cart updates
    const handleCartUpdate = () => checkCartStatus();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [item.product_id]);

  const checkCartStatus = async () => {
    try {
      const response = await getCart();
      const cartItems = response.data?.items || [];
      const inCart = cartItems.some(cartItem => cartItem.product_id === item.product_id);
      setIsInCart(inCart);
    } catch (error) {
      // Silently fail - cart might be empty
      setIsInCart(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get displayed price (prefer sale_price if available)
  const getDisplayPrice = () => {
    const salePrice = parseFloat(item.sale_price);
    const regularPrice = parseFloat(item.price);
    
    if (salePrice && salePrice > 0) {
      return salePrice;
    }
    return regularPrice || 0;
  };

  // Check if item is in stock
  const isInStock = () => {
    return item.quantity_available > 0 && item.is_active;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (isInCart) {
      // Navigate to cart if already in cart
      navigate("/cart");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(item.product_id, 1);
      
      // Update local state immediately
      setIsInCart(true);
      
      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));
      
      setNotification({ text: "Added to Cart!", type: "success", icon: "shopping_cart" });
    } catch (err) {
      setNotification({ text: err.message || "Failed to add to cart", type: "error", icon: "error" });
    } finally {
      setAddingToCart(false);
    }
  };

  // Clear notification
  const clearNotification = () => {
    setNotification(null);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.wishlistItem}>
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product_id)}
        disabled={updating}
        className={styles.removeButton}
        title="Remove from wishlist"
      >
        <i className="material-icons">close</i>
      </button>

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
        
        {item.category_name && (
          <p className={styles.category}>{item.category_name}</p>
        )}

        <p className={styles.price}>${getDisplayPrice().toFixed(2)}</p>

        {/* Stock Status */}
        {isInStock() ? (
          <p className={styles.inStock}>In Stock ({item.quantity_available})</p>
        ) : (
          <p className={styles.outOfStock}>Out of Stock</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <AddToCartBtn
          onClick={handleAddToCart}
          loading={addingToCart}
          isInCart={isInCart}
          disabled={!isInStock() && !isInCart}
          size="medium"
        />
        
        {/* Notification Popup */}
        {notification && (
          <FadeNotification
            type={notification.type}
            text={notification.text}
            icon={notification.icon}
            position="top"
            onComplete={clearNotification}
          />
        )}
      </div>
    </div>
  );
};

export default WishlistItem;
