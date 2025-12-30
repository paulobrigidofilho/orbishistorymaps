///////////////////////////////////////////////////////////////////////
// ====================== PRODUCT CARD COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component displays a single product in the product grid

//  ========== Module imports  ========== //
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";

//  ========== Component imports  ========== //
import WishlistToggleBtn from "../../common/wishlist/components/WishlistToggleBtn";
import RatingModal from "./RatingModal";

///////////////////////////////////////////////////////////////////////
// ========================= PRODUCT CARD ============================ //
///////////////////////////////////////////////////////////////////////

// Default product image path
const DEFAULT_PRODUCT_IMAGE = "/assets/common/default-product-img.png";

const ProductCard = ({ product }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const navigate = useNavigate();

  // Calculate if product is on sale
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);
  const displayPrice = isOnSale ? parseFloat(product.sale_price) : parseFloat(product.price);
  const discountPercent = isOnSale
    ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100)
    : 0;
  
  // Get product image with fallback to default
  const productImage = product.primary_image || DEFAULT_PRODUCT_IMAGE;

  // Dummy breakdown, replace with real data
  const ratingBreakdown = product.rating_breakdown || { 5: 80, 4: 10, 3: 5, 2: 3, 1: 2 };

  const handleSeeAllComments = (e) => {
    e.stopPropagation();
    setShowRatingModal(false);
    navigate(`/shop/product/${product.product_slug}#reviews`);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.productCard}>
      {/* Wishlist Button */}
      <div className={styles.wishlistBtnWrapper}>
        <WishlistToggleBtn productId={product.product_id} />
      </div>
      <Link to={`/shop/product/${product.product_slug}`} className={styles.productLink}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          {isOnSale && (
            <span className={styles.saleBadge}>-{discountPercent}%</span>
          )}
          <img
            src={productImage}
            alt={product.product_name}
            className={styles.productImage}
            onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
          />
        </div>
        {/* Product Info */}
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.product_name}</h3>
          {/* Category */}
          {product.category_name && (
            <p className={styles.category}>{product.category_name}</p>
          )}
          {/* Price */}
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>${displayPrice.toFixed(2)}</span>
            {isOnSale && (
              <span className={styles.originalPrice}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
            )}
          </div>
          {/* Stock Status */}
          {product.quantity_available <= 0 && (
            <p className={styles.outOfStock}>Out of Stock</p>
          )}
          {product.quantity_available > 0 && product.quantity_available < 10 && (
            <p className={styles.lowStock}>Only {product.quantity_available} left!</p>
          )}
          {/* Rating */}
          {parseFloat(product.rating_average) > 0 && (
            <div
              className={styles.rating}
              style={{ cursor: "pointer" }}
              onClick={e => { e.preventDefault(); setShowRatingModal(true); }}
            >
              <span className={styles.stars}>
                {"★".repeat(Math.round(parseFloat(product.rating_average)))}
                {"☆".repeat(5 - Math.round(parseFloat(product.rating_average)))}
              </span>
              <span className={styles.reviewCount}>({product.rating_count})</span>
            </div>
          )}
        </div>
      </Link>
      <RatingModal
        open={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        average={parseFloat(product.rating_average) || 0}
        total={product.rating_count || 0}
        breakdown={ratingBreakdown}
        onSeeAllComments={handleSeeAllComments}
      />
    </div>
  );
};

export default ProductCard;
