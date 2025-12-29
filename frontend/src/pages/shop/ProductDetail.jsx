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
import WishlistToggleBtn from "../common/wishlist/components/WishlistToggleBtn";
import QuantitySelector from "./btn/QuantitySelector";
import AddToCartBtn from "./btn/AddToCartBtn";
import ProceedToCheckoutBtn from "./btn/ProceedToCheckoutBtn";
import FadeNotification from "../common/components/FadeNotification";

//  ========== Function imports  ========== //
import getProductDetails from "./functions/productService/getProductDetails";
import addToCart from "./functions/cartService/addToCart";

//  ========== Helper imports  ========== //
import handleQuantityChange from "./helpers/handleQuantityChange";

//  ========== Context imports  ========== //
import { AuthContext } from "../common/context/AuthContext";

// Default product image path
const DEFAULT_PRODUCT_IMAGE = "/assets/common/default-product-img.png";

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
  const [notification, setNotification] = useState(null);
  const [showCheckoutBtn, setShowCheckoutBtn] = useState(false);

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
  const addProductToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.product_id, quantity);
      
      // Dispatch cart update event
      window.dispatchEvent(new Event("cartUpdated"));
      
      // Show success notification
      setNotification({ type: "success", text: "Added to Cart!", icon: "shopping_cart" });
      // Show proceed to checkout button on successful add
      setShowCheckoutBtn(true);
    } catch (err) {
      setNotification({ type: "error", text: err.message || "Failed to add to cart", icon: "error" });
    } finally {
      setAddingToCart(false);
    }
  };

  // Clear notification
  const clearNotification = () => {
    setNotification(null);
  };

  // Handle quantity change
  const changeQuantity = (change) => 
    handleQuantityChange(quantity, change, product.quantity_available, setQuantity);

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

  // Get primary image from images array or use primary_image field, with fallback to default
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.primary_image ||
    DEFAULT_PRODUCT_IMAGE;

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
            <img
              src={primaryImage}
              alt={product.product_name}
              className={styles.productImage}
              onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
            />
          </div>

          {/* Product Info Section */}
          <div className={styles.infoSection}>
            {/* Category Badge & Wishlist Button */}
            <div className={styles.topSection}>
              {product.category_name && (
                <span className={styles.categoryBadge}>
                  {product.category_name}
                </span>
              )}
              <div className={styles.wishlistBtnWrapper}>
                <WishlistToggleBtn productId={product.product_id} />
              </div>
            </div>

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
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={() => changeQuantity(-1)}
                  onIncrease={() => changeQuantity(1)}
                  disableDecrease={quantity <= 1}
                  disableIncrease={quantity >= product.quantity_available}
                  size="medium"
                />

                {/* Add to Cart Button */}
                <AddToCartBtn
                  onClick={addProductToCart}
                  loading={addingToCart}
                  showIcon={false}
                  size="large"
                />

                {/* Proceed to Checkout Button - shows after adding to cart */}
                <ProceedToCheckoutBtn
                  show={showCheckoutBtn}
                  showIcon={true}
                  size="large"
                />

                {/* Notification Popup */}
                {notification && (
                  <FadeNotification
                    type={notification.type}
                    text={notification.text}
                    icon={notification.icon}
                    position="right"
                    onComplete={clearNotification}
                  />
                )}
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
