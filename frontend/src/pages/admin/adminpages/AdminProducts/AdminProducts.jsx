///////////////////////////////////////////////////////////////////////
// ===================== ADMIN PRODUCTS PAGE ========================= //
///////////////////////////////////////////////////////////////////////

// This page displays product management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminProducts.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";
import PriceDisplay from "../../components/PriceDisplay";
import ProductEditModal from "./subcomponents/ProductEditModal";
import AddProductModal from "./subcomponents/AddProductModal";
import DeleteProductModal from "./subcomponents/DeleteProductModal";
import ProductRatingsModal from "./subcomponents/ProductRatingsModal";
import { EditBtn, DeleteBtn, AddBtn } from "../../btn";

//  ========== Constants imports (Search)  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";

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
  // ========================= HOOKS ================================= //
  ///////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();

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
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);
  const [selectedProductForRatings, setSelectedProductForRatings] = useState(null);

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
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.category_id,
    filters.is_active,
    filters.is_featured,
    sortConfig.field,
    sortConfig.order,
  ]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  const handleStatusChange = async (productId, newStatus) => {
    if (
      !window.confirm(
        `Change product status to ${newStatus ? "Active" : "Inactive"}?`
      )
    )
      return;

    try {
      await updateProduct(productId, { is_active: newStatus });
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleFeaturedChange = async (productId, newFeatured) => {
    if (
      !window.confirm(`${newFeatured ? "Feature" : "Unfeature"} this product?`)
    )
      return;

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
      const newOrder =
        prev.field === field && prev.order === "asc" ? "desc" : "asc";
      return { field, order: newOrder };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  // Ratings Modal handlers
  const handleOpenRatingsModal = (product) => {
    setSelectedProductForRatings(product);
    setIsRatingsModalOpen(true);
  };

  const handleCloseRatingsModal = () => {
    setIsRatingsModalOpen(false);
    setSelectedProductForRatings(null);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  // Prepare dynamic options for categories filter
  const categoryOptions = categories.map((category) => ({
    value: category.category_id,
    label: category.category_name,
  }));

  // Column definitions for the products table
  const columns = [
    { key: "id", label: "ID", sortable: true, sortField: "product_id" },
    { key: "product", label: "Product", sortable: true, sortField: "product_name" },
    { key: "sku", label: "SKU", sortable: true, sortField: "sku" },
    { key: "category", label: "Category", sortable: false },
    { key: "price", label: "Price", sortable: true, sortField: "price" },
    { key: "stock", label: "Stock", sortable: true, sortField: "quantity_available" },
    { key: "views", label: "Views", sortable: true, sortField: "view_count" },
    { key: "rating", label: "Rating", sortable: true, sortField: "rating_average" },
    { key: "wishlists", label: "Wishlists", sortable: false },
    { key: "status", label: "Status", sortable: false },
    { key: "featured", label: "Featured", sortable: false },
    { key: "created", label: "Created", sortable: true, sortField: "created_at" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Render function for table rows
  const renderRow = (product) => (
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
        <span className={styles.categoryBadge}>{product.category_name || "—"}</span>
      </td>
      <td>
        <PriceDisplay
          price={product.price}
          salePrice={product.sale_price}
          size="small"
        />
      </td>
      <td>
        <span
          className={`${styles.stock} ${
            styles[getStockLevelClass(product.quantity_available || 0)]
          }`}
        >
          {product.quantity_available || 0}
        </span>
      </td>
      <td className={styles.viewsCell}>{product.view_count || 0}</td>
      <td>
        <button
          className={styles.ratingCellBtn}
          onClick={() => handleOpenRatingsModal(product)}
          title="View rating breakdown"
        >
          <span className={styles.ratingAvg}>
            ⭐ {parseFloat(product.rating_average || 0).toFixed(1)}
          </span>
          <span className={styles.ratingCount}>({product.rating_count || 0})</span>
        </button>
      </td>
      <td>
        <button
          className={styles.wishlistCountBtn}
          onClick={() => navigate(`/admin/wishlists?search=${encodeURIComponent(product.product_name)}`)}
          title="View wishlist details"
        >
          ❤️ {product.wishlist_count || 0}
        </button>
      </td>
      <td>
        <select
          value={product.is_active ? "true" : "false"}
          onChange={(e) =>
            handleStatusChange(product.product_id, e.target.value === "true")
          }
          className={`${viewStyles.inlineSelect} ${
            product.is_active ? viewStyles.active : viewStyles.inactive
          }`}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </td>
      <td>
        <select
          value={product.is_featured ? "true" : "false"}
          onChange={(e) =>
            handleFeaturedChange(product.product_id, e.target.value === "true")
          }
          className={`${styles.inlineSelect} ${
            product.is_featured ? styles.selectFeatured : styles.selectNotFeatured
          }`}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>{formatDateDMY(product.created_at)}</td>
      <td>
        <div className={viewStyles.actions}>
          <EditBtn onClick={() => handleEditProduct(product)} title="Edit product" />
          <DeleteBtn onClick={() => handleDeleteProduct(product)} title="Delete product" />
        </div>
      </td>
    </tr>
  );

  return (
    <AdminManagementView
      // Page configuration
      pageType={ADMIN_PAGE_TYPES.PRODUCTS}
      title="Product Management"
      headerAction={<AddBtn onClick={handleOpenAddModal}>+ Add Product</AddBtn>}
      // Search and filter props
      searchValue={filters.search}
      onSearchChange={(value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }}
      filters={filters}
      onFilterChange={handleFilterChange}
      dynamicOptions={{ category_id: categoryOptions }}
      // Loading and error states
      loading={loading}
      error={error}
      loadingText="Loading products..."
      // Data and pagination
      data={products}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage="No products found"
      emptyHint={
        <AddBtn onClick={handleOpenAddModal}>Add Your First Product</AddBtn>
      }
      // Table configuration
      columns={columns}
      renderRow={renderRow}
      // Sorting
      sortConfig={sortConfig}
      onSort={handleSort}
    >
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

      {/* Product Ratings Modal */}
      <ProductRatingsModal
        product={selectedProductForRatings}
        isOpen={isRatingsModalOpen}
        onClose={handleCloseRatingsModal}
      />
    </AdminManagementView>
  );
}
