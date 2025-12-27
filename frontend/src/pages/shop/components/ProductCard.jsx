///////////////////////////////////////////////////////////////////////
// ====================== PRODUCT CARD COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component displays a single product in the product grid

//  ========== Module imports  ========== //
import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

///////////////////////////////////////////////////////////////////////
// ========================= PRODUCT CARD ============================ //
///////////////////////////////////////////////////////////////////////

const ProductCard = ({ product }) => {
  // Calculate if product is on sale
  const isOnSale = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);
  const displayPrice = isOnSale ? parseFloat(product.sale_price) : parseFloat(product.price);
  const discountPercent = isOnSale
    ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100)
    : 0;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.productCard}>
      <Link to={`/shop/product/${product.product_slug}`} className={styles.productLink}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          {isOnSale && (
            <span className={styles.saleBadge}>-{discountPercent}%</span>
          )}
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.product_name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
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
            <div className={styles.rating}>
              <span className={styles.stars}>
                {"★".repeat(Math.round(parseFloat(product.rating_average)))}
                {"☆".repeat(5 - Math.round(parseFloat(product.rating_average)))}
              </span>
              <span className={styles.reviewCount}>({product.rating_count})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
