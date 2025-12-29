///////////////////////////////////////////////////////////////////////
// ===================== ADMIN PRODUCTS PAGE ========================= //
///////////////////////////////////////////////////////////////////////

// This page displays product management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import styles from "./AdminProducts.module.css";

//  ========== Component imports  ========== //
import AdminLayout from "../../components/AdminLayout";
import ProductEditModal from "./subcomponents/ProductEditModal";
import AddProductModal from "./subcomponents/AddProductModal";
import DeleteProductModal from "./subcomponents/DeleteProductModal";
import { EditBtn, DeleteBtn, AddBtn, PageBtn } from "../../btn";

//  ========== Function imports  ========== //
import getAllProducts from "../../functions/getAllProducts";
import getAllCategories from "../../functions/getAllCategories";
import updateProduct from "../../functions/updateProduct";
import deleteProduct from "../../functions/deleteProduct";
import formatDateDMY from "../../helpers/formatDateDMY";

//  ========== Constants imports  ========== //
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";
import { SUCCESS_MESSAGES } from "../../constants/adminSuccessMessages";
import { getStockLevelClass } from "../../constants/adminConstants";

///////////////////////////////////////////////////////////////////////
// ====================== ADMIN PRODUCTS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

export default function AdminProducts() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [sortConfig, setSortConfig] = useState({
    field: "created_at",
    order: "desc",
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        search: filters.search,
        category_id: filters.category_id,
        is_active: filters.is_active,
        is_featured: filters.is_featured,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
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

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.data && response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters.search, filters.category_id, filters.is_active, filters.is_featured, sortConfig.field, sortConfig.order]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleStatusChange = async (productId, newStatus) => {
    if (!window.confirm(`Change product status to ${newStatus ? "Active" : "Inactive"}?`)) return;

    try {
      await updateProduct(productId, { is_active: newStatus });
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleFeaturedChange = async (productId, newFeatured) => {
    if (!window.confirm(`${newFeatured ? "Feature" : "Unfeature"} this product?`)) return;

    try {
      await updateProduct(productId, { is_featured: newFeatured });
      fetchProducts();
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

  const handleSort = (field) => {
    setSortConfig((prev) => {
      const newOrder = prev.field === field && prev.order === "asc" ? "desc" : "asc";
      return { field, order: newOrder };
  });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return "↕";
    return sortConfig.order === "asc" ? "↑" : "↓";
  };

  // Add Modal handlers
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleProductCreated = (newProduct) => {
    fetchProducts(); // Refresh the product list
  };

  // Edit Modal handlers
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productId, updates) => {
    try {
      await updateProduct(productId, updates);
      fetchProducts();
    } catch (err) {
      throw err;
    }
  };

  // Delete Modal handlers
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async (productId) => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminLayout>
      <div className={styles.productsPage}>
        <div className={styles.header}>
          <h1>Product Management</h1>
          <AddBtn onClick={handleOpenAddModal}>
            + Add Product
          </AddBtn>
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
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>

          <select
            value={filters.is_active}
            onChange={(e) => handleFilterChange("is_active", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={filters.is_featured}
            onChange={(e) => handleFilterChange("is_featured", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Featured</option>
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
                  <th className={styles.sortable} onClick={() => handleSort("product_id")}>
                    ID <span className={styles.sortIcon}>{getSortIcon("product_id")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("product_name")}>
                    Product <span className={styles.sortIcon}>{getSortIcon("product_name")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("sku")}>
                    SKU <span className={styles.sortIcon}>{getSortIcon("sku")}</span>
                  </th>
                  <th>Category</th>
                  <th className={styles.sortable} onClick={() => handleSort("price")}>
                    Price <span className={styles.sortIcon}>{getSortIcon("price")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("quantity_available")}>
                    Stock <span className={styles.sortIcon}>{getSortIcon("quantity_available")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("view_count")}>
                    Views <span className={styles.sortIcon}>{getSortIcon("view_count")}</span>
                  </th>
                  <th className={styles.sortable} onClick={() => handleSort("rating_average")}>
                    Rating <span className={styles.sortIcon}>{getSortIcon("rating_average")}</span>
                  </th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th className={styles.sortable} onClick={() => handleSort("created_at")}>
                    Created <span className={styles.sortIcon}>{getSortIcon("created_at")}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id}>
                    <td className={styles.idCell}>{product.product_id}</td>
                    <td>
                      <div className={styles.productInfo}>
                        <strong>{product.product_name}</strong>
                        {product.brand && <span className={styles.brand}>{product.brand}</span>}
                      </div>
                    </td>
                    <td>{product.sku || "N/A"}</td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {product.category_name || "—"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.priceCell}>
                        <span className={product.sale_price ? styles.originalPrice : ""}>
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        {product.sale_price && (
                          <span className={styles.salePrice}>
                            ${parseFloat(product.sale_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.stock} ${styles[getStockLevelClass(product.quantity_available || 0)]}`}
                      >
                        {product.quantity_available || 0}
                      </span>
                    </td>
                    <td className={styles.viewsCell}>
                      {product.view_count || 0}
                    </td>
                    <td>
                      <div className={styles.ratingCell}>
                        <span className={styles.ratingAvg}>
                          ⭐ {parseFloat(product.rating_average || 0).toFixed(1)}
                        </span>
                        <span className={styles.ratingCount}>
                          ({product.rating_count || 0})
                        </span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={product.is_active ? "true" : "false"}
                        onChange={(e) => handleStatusChange(product.product_id, e.target.value === "true")}
                        className={`${styles.inlineSelect} ${product.is_active ? styles.selectActive : styles.selectInactive}`}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={product.is_featured ? "true" : "false"}
                        onChange={(e) => handleFeaturedChange(product.product_id, e.target.value === "true")}
                        className={`${styles.inlineSelect} ${product.is_featured ? styles.selectFeatured : styles.selectNotFeatured}`}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>{formatDateDMY(product.created_at)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <EditBtn
                          onClick={() => handleEditProduct(product)}
                          title="Edit product"
                        />
                        <DeleteBtn
                          onClick={() => handleDeleteProduct(product)}
                          title="Delete product"
                        />
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
            <AddBtn onClick={handleOpenAddModal}>
              Add Your First Product
            </AddBtn>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <PageBtn
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </PageBtn>
            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <PageBtn
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </PageBtn>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleProductCreated}
        categories={categories}
      />

      {/* Product Edit Modal */}
      <ProductEditModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduct}
        categories={categories}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        product={productToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
}
