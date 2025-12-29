///////////////////////////////////////////////////////////////////////
// ========================== SHOP PAGE ============================== //
///////////////////////////////////////////////////////////////////////

// This page displays the shop with product listings and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./Shop.module.css";

//  ========== Component imports  ========== //
import MainNavBar from "../common/MainNavBar";
import ProductGrid from "./components/ProductGrid";

//  ========== Function imports  ========== //
import getAllProducts from "./functions/productService/getAllProducts";

///////////////////////////////////////////////////////////////////////
// =========================== SHOP PAGE ============================= //
///////////////////////////////////////////////////////////////////////

export default function Shop() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    minPrice: null,
    maxPrice: null,
    search: "",
    featured: false,
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch products on component mount and when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts(filters);
        setProducts(data.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Handle search input change
  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.shopPage}>
      {/* Navigation Bar */}
      <MainNavBar />

      {/* Shop Container */}
      <div className={styles.shopContainer}>
        {/* Page Header */}
        <div className={styles.shopHeader}>
          <h1>Orbis Historical Maps Shop</h1>
          <p>Discover authentic historical maps and prints</p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for maps, prints, and more..."
            value={filters.search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}
