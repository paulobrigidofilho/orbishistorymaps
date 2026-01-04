///////////////////////////////////////////////////////////////////////
// ===================== ADMIN WISHLISTS PAGE ======================== //
///////////////////////////////////////////////////////////////////////

// Admin dashboard for viewing products with wishlist statistics
// Shows wishlist counts per product and users who wishlisted each product

//  ========== Module imports  ========== //
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./AdminWishlists.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";
import PriceDisplay from "../../components/PriceDisplay";
import WishlistModal from "./subcomponents/WishlistModal";

//  ========== Constants imports  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";

//  ========== Asset imports  ========== //
const DEFAULT_PRODUCT_IMAGE = "/assets/common/default-product-img.png";
import { ERROR_MESSAGES } from "../../constants/adminErrorMessages";

//  ========== Function imports  ========== //
import getAllWishlists from "../../functions/getAllWishlists";
import formatDateDMY from "../../helpers/formatDateDMY";

///////////////////////////////////////////////////////////////////////
// ======================== ADMIN WISHLISTS PAGE ===================== //
///////////////////////////////////////////////////////////////////////

export default function AdminWishlists() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= URL PARAMS ============================= //
  ///////////////////////////////////////////////////////////////////////

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get("search") || "";

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: initialSearch,
  });
  const [sortConfig, setSortConfig] = useState({
    field: "wishlist_count",
    order: "desc",
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllWishlists({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });

      setWishlists(result.data || []);
      setPagination((prev) => ({ ...prev, ...result.pagination }));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching wishlists:", err);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchWishlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters.search, sortConfig.field, sortConfig.order]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

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

  // Open modal to show users who wishlisted the product
  const handleViewUsers = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Navigate to AdminUsers with user filtered
  const handleUserClick = (userId, userEmail) => {
    setIsModalOpen(false);
    navigate(`/admin/users?search=${encodeURIComponent(userEmail)}`);
  };

  ///////////////////////////////////////////////////////////////////////
  // ====================== TABLE CONFIGURATION ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Column definitions for the wishlists table
  const columns = [
    { key: "product_id", label: "ID", sortable: true, sortField: "product_id" },
    { key: "product", label: "Product", sortable: true, sortField: "product_name" },
    { key: "sku", label: "SKU", sortable: true, sortField: "sku" },
    { key: "category", label: "Category", sortable: false },
    { key: "price", label: "Price", sortable: true, sortField: "price" },
    { key: "wishlist_count", label: "Wishlist Count", sortable: true, sortField: "wishlist_count" },
    { key: "status", label: "Status", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Render function for table rows
  const renderRow = (product) => (
    <tr key={product.product_id}>
      <td className={styles.idCell}>{product.product_id}</td>
      <td>
        <div className={styles.productInfo}>
          <img
            src={product.primary_image || DEFAULT_PRODUCT_IMAGE}
            alt={product.product_name}
            className={styles.thumbnail}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
          <strong>{product.product_name}</strong>
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
        <button
          className={styles.wishlistCountBtn}
          onClick={() => handleViewUsers(product)}
          title="View users who wishlisted this product"
        >
          ❤️ {product.wishlist_count}
        </button>
      </td>
      <td>
        <span className={`${viewStyles.badge} ${product.is_active ? viewStyles.active : viewStyles.inactive}`}>
          {product.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <div className={viewStyles.actions}>
          <button
            className={styles.viewUsersBtn}
            onClick={() => handleViewUsers(product)}
            title="View wishlist users"
          >
            👥 View Users
          </button>
        </div>
      </td>
    </tr>
  );

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <AdminManagementView
      // Page configuration
      pageType={ADMIN_PAGE_TYPES.WISHLISTS}
      title="Wishlist Management"
      // Search and filter props
      searchValue={filters.search}
      onSearchChange={(value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      }}
      filters={filters}
      onFilterChange={handleFilterChange}
      // Loading and error states
      loading={loading}
      error={error}
      loadingText="Loading wishlists..."
      // Data and pagination
      data={wishlists}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage="No wishlisted products found"
      emptyHint="Products will appear here when users add them to their wishlists"
      // Table configuration
      columns={columns}
      renderRow={renderRow}
      // Sorting
      sortConfig={sortConfig}
      onSort={handleSort}
    >
      {/* Wishlist Users Modal */}
      <WishlistModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUserClick={handleUserClick}
      />
    </AdminManagementView>
  );
}
