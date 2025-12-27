///////////////////////////////////////////////////////////////////////
// ====================== PRODUCT DETAIL PAGE ======================== //
///////////////////////////////////////////////////////////////////////

// This page displays detailed information about a single product

//  ========== Module imports  ========== //
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";

//  ========== Service imports  ========== //
import { getProductDetails } from "./services/productService";
import { addToCart } from "./services/cartService";

//  ========== Context imports  ========== //
import { AuthContext } from "../common/context/AuthContext";

///////////////////////////////////////////////////////////////////////
// ====================== PRODUCT DETAIL PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function ProductDetail() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const { identifier } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductDetails(identifier);
        setProduct(data.data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [identifier]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage(null);

      await addToCart(product.product_id, quantity);

      // Dispatch custom event to update cart badge
      window.dispatchEvent(new Event("cartUpdated"));

      setCartMessage({ type: "success", text: "Added to cart successfully!" });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage({
        type: "error",
        text: err.message || "Failed to add to cart",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity_available) {
      setQuantity(newQuantity);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE ========================= //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.productDetailPage}>
        <MainNavBar />
        <div className={styles.loadingContainer}>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (error || !product) {
    return (
      <div className={styles.productDetailPage}>
        <MainNavBar />
        <div className={styles.errorContainer}>
          <h2>Product Not Found</h2>
          <p>{error || "This product does not exist."}</p>
          <button
            onClick={() => navigate("/shop")}
            className={styles.backButton}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Calculate price and sale info (after null check)
  const isOnSale =
    product.sale_price &&
    parseFloat(product.sale_price) < parseFloat(product.price);
  const displayPrice = isOnSale
    ? parseFloat(product.sale_price)
    : parseFloat(product.price);
  const discountPercent = isOnSale
    ? Math.round(
        ((parseFloat(product.price) - parseFloat(product.sale_price)) /
          parseFloat(product.price)) *
          100
      )
    : 0;

  // Get primary image from images array or use primary_image field
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.primary_image;

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.productDetailPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Product Detail Container */}
      <div className={styles.productContainer}>
        {/* Back Button */}
        <button onClick={() => navigate("/shop")} className={styles.backLink}>
          ← Back to Shop
        </button>

        <div className={styles.productContent}>
          {/* Product Image Section */}
          <div className={styles.imageSection}>
            {isOnSale && (
              <span className={styles.saleBadge}>-{discountPercent}% OFF</span>
            )}
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.product_name}
                className={styles.productImage}
              />
            ) : (
              <div className={styles.noImage}>No Image Available</div>
            )}
          </div>

          {/* Product Info Section */}
          <div className={styles.infoSection}>
            {/* Category Badge */}
            {product.category_name && (
              <span className={styles.categoryBadge}>
                {product.category_name}
              </span>
            )}

            {/* Product Name */}
            <h1 className={styles.productName}>{product.product_name}</h1>

            {/* SKU */}
            {product.sku && <p className={styles.sku}>SKU: {product.sku}</p>}

            {/* Price Section */}
            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>
                ${displayPrice.toFixed(2)}
              </span>
              {isOnSale && (
                <>
                  <span className={styles.originalPrice}>
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className={styles.savingsText}>
                    Save $
                    {(
                      parseFloat(product.price) - parseFloat(product.sale_price)
                    ).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            {parseFloat(product.rating_average) > 0 && (
              <div className={styles.rating}>
                <span className={styles.stars}>
                  {"★".repeat(Math.round(parseFloat(product.rating_average)))}
                  {"☆".repeat(
                    5 - Math.round(parseFloat(product.rating_average))
                  )}
                </span>
                <span className={styles.ratingText}>
                  {parseFloat(product.rating_average).toFixed(1)} (
                  {product.rating_count} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.product_description}</p>
            </div>

            {/* Additional Details */}
            {product.product_details && (
              <div className={styles.details}>
                <h3>Details</h3>
                <p>{product.product_details}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className={styles.stockStatus}>
              {product.quantity_available <= 0 ? (
                <span className={styles.outOfStock}>Out of Stock</span>
              ) : product.quantity_available < 10 ? (
                <span className={styles.lowStock}>
                  Only {product.quantity_available} left in stock!
                </span>
              ) : (
                <span className={styles.inStock}>In Stock</span>
              )}
            </div>

            {/* Quantity Selector and Add to Cart */}
            {product.quantity_available > 0 && (
              <div className={styles.purchaseSection}>
                {/* Quantity Selector */}
                <div className={styles.quantitySelector}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={styles.quantityButton}
                  >
                    −
                  </button>
                  <span className={styles.quantityDisplay}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity_available}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={styles.addToCartButton}
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            )}

            {/* Cart Message */}
            {cartMessage && (
              <div
                className={`${styles.cartMessage} ${styles[cartMessage.type]}`}
              >
                {cartMessage.text}
              </div>
            )}

            {/* Product Meta Info */}
            <div className={styles.metaInfo}>
              {product.brand && (
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}
              {product.weight && (
                <p>
                  <strong>Weight:</strong> {product.weight} kg
                </p>
              )}
              {product.dimensions && (
                <p>
                  <strong>Dimensions:</strong> {product.dimensions}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
