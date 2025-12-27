///////////////////////////////////////////////////////////////////////
// ===================== ADMIN PRODUCTS PAGE ========================= //
///////////////////////////////////////////////////////////////////////

// This page displays product management with CRUD operations

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminProducts.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";

//  ========== Function imports  ========== //
import getAllProducts from "../../functions/getAllProducts";
import deleteProduct from "../../functions/deleteProduct";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";

///////////////////////////////////////////////////////////////////////
// ====================== ADMIN PRODUCTS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminProducts() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    is_active: "",
    is_featured: "",
  });

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setProducts(data.data || []);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (err) {
      setError(err.message);
      console.error(ERROR_MESSAGES.FETCH_PRODUCTS_ERROR, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.productsPage}>
        <div className={styles.header}>
          <h1>Product Management</h1>
          <Link to="/admin/products/new" className={styles.addButton}>
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={filters.search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          <select
            value={filters.is_active}
            onChange={(e) => handleFilterChange("is_active", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Products</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={filters.is_featured}
            onChange={(e) => handleFilterChange("is_featured", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Featured Status</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Loading State */}
        {loading && <div className={styles.loading}>Loading products...</div>}

        {/* Products Table */}
        {!loading && products.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.product_id}</td>
                    <td>
                      <div className={styles.productInfo}>
                        <strong>{product.product_name}</strong>
                      </div>
                    </td>
                    <td>{product.sku || "N/A"}</td>
                    <td>
                      ${product.price}
                      {product.sale_price && (
                        <span className={styles.salePrice}> (${product.sale_price})</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.stock} ${
                          product.quantity_available > 0 ? styles.inStock : styles.outOfStock
                        }`}
                      >
                        {product.quantity_available}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          product.is_active ? styles.active : styles.inactive
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          product.is_featured ? styles.featured : styles.notFeatured
                        }`}
                      >
                        {product.is_featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/admin/products/edit/${product.product_id}`}
                          className={styles.editButton}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className={styles.emptyState}>
            <p>No products found</p>
            <Link to="/admin/products/new" className={styles.addButton}>
              Add Your First Product
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
