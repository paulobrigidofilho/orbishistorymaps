///////////////////////////////////////////////////////////////////////
// ====================== PRODUCT GRID COMPONENT ===================== //
///////////////////////////////////////////////////////////////////////

// This component displays a grid of products

//  ========== Module imports  ========== //
import React from "react";
import styles from "./ProductGrid.module.css";

//  ========== Component imports  ========== //
import ProductCard from "./ProductCard";

///////////////////////////////////////////////////////////////////////
// ========================= PRODUCT GRID ============================ //
///////////////////////////////////////////////////////////////////////

const ProductGrid = ({ products, loading, error }) => {
  ///////////////////////////////////////////////////////////////////////
  // ========================= LOADING STATE =========================== //
  ///////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading products...</p>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= ERROR STATE ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= EMPTY STATE ============================= //
  ///////////////////////////////////////////////////////////////////////

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p>No products found.</p>
      </div>
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW =============================== //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
