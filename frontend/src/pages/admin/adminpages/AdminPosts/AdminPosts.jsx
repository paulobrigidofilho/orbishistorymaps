///////////////////////////////////////////////////////////////////////
// ===================== ADMIN POSTS PAGE ============================ //
///////////////////////////////////////////////////////////////////////

// This page displays post management with pagination and filters

//  ========== Module imports  ========== //
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./AdminPosts.module.css";

//  ========== Component imports  ========== //
import AdminManagementView from "../../components/AdminManagementView";
import viewStyles from "../../components/AdminManagementView.module.css";
import PostEditModal from "./subcomponents/PostEditModal";
import DeletePostModal from "./subcomponents/DeletePostModal";
import { EditBtn, DeleteBtn, AddBtn } from "../../btn";
import AdminAlertModal from "../../components/AdminAlertModal/AdminAlertModal";

//  ========== Constants imports (Search)  ========== //
import { ADMIN_PAGE_TYPES } from "../../constants/adminSearchBarConstants";

//  ========== Function imports  ========== //
import { fetchPosts } from "./functions/fetchPosts";
import { togglePostStatus } from "./functions/togglePostStatus";
import { deletePost } from "./functions/deletePost";

//  ========== Constants imports  ========== //
import { POST_LABELS, POST_FILTERS, POST_PAGINATION } from "./constants/postConstants";
import {
  ADMIN_ERROR_ALERT_MESSAGES,
} from "../../constants/adminAlertModalConstants";

//  ========== Helper imports  ========== //
import formatDateDMY from "../../helpers/formatDateDMY";

///////////////////////////////////////////////////////////////////////
// ====================== ADMIN POSTS PAGE =========================== //
///////////////////////////////////////////////////////////////////////

export default function AdminPosts() {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HOOKS ================================= //
  ///////////////////////////////////////////////////////////////////////

  const [searchParams] = useSearchParams();

  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: POST_PAGINATION.DEFAULT_PAGE,
    limit: POST_PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "created_at",
    order: "desc",
  });

  // Modal states
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // AdminAlertModal state for confirmations
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    config: {},
    onConfirm: null,
    isLoading: false,
  });

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      });
      setPosts(data.posts || data.data || []);
      if (data.pagination) {
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      }
    } catch (err) {
      setError(err.message || POST_LABELS.MESSAGES.ERROR_LOADING);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOK ======================= //
  ///////////////////////////////////////////////////////////////////////

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.status,
    sortConfig.field,
    sortConfig.order,
  ]);

  ///////////////////////////////////////////////////////////////////////
  // ======================= EVENT HANDLERS ========================== //
  ///////////////////////////////////////////////////////////////////////

  // Close alert modal helper
  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, config: {}, onConfirm: null, isLoading: false });
  };

  // Show error alert helper
  const showErrorAlert = (errorMessage) => {
    setAlertModal({
      isOpen: true,
      config: ADMIN_ERROR_ALERT_MESSAGES.GENERIC_ERROR(errorMessage),
      onConfirm: closeAlertModal,
      isLoading: false,
    });
  };

  // Handle status toggle
  const handleStatusToggle = async (post) => {
    try {
      await togglePostStatus(post.post_id);
      loadPosts();
    } catch (err) {
      showErrorAlert(err.message || "Failed to toggle post status");
    }
  };

  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
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

  // Create Modal handlers
  const handleOpenCreateModal = () => {
    setSelectedPost(null);
    setIsCreateMode(true);
    setIsEditModalOpen(true);
  };

  // Edit Modal handlers
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsCreateMode(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPost(null);
    setIsCreateMode(false);
  };

  const handlePostSaved = () => {
    loadPosts();
  };

  // Delete Modal handlers
  const handleDeletePost = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = async (postId) => {
    setIsDeleting(true);
    try {
      await deletePost(postId);
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
      loadPosts();
    } catch (err) {
      showErrorAlert(err.message || POST_LABELS.MESSAGES.ERROR_DELETING);
    } finally {
      setIsDeleting(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  // Column definitions for the posts table
  const columns = [
    { key: "id", label: "ID", sortable: true, sortField: "post_id" },
    { key: "title", label: POST_LABELS.TABLE_HEADERS.TITLE, sortable: true, sortField: "post_title" },
    { key: "author", label: POST_LABELS.TABLE_HEADERS.AUTHOR, sortable: false },
    { key: "status", label: POST_LABELS.TABLE_HEADERS.STATUS, sortable: true, sortField: "post_status" },
    { key: "publishDate", label: POST_LABELS.TABLE_HEADERS.PUBLISH_DATE, sortable: true, sortField: "post_publish_date" },
    { key: "views", label: POST_LABELS.TABLE_HEADERS.VIEWS, sortable: true, sortField: "post_view_count" },
    { key: "created", label: "Created", sortable: true, sortField: "created_at" },
    { key: "actions", label: POST_LABELS.TABLE_HEADERS.ACTIONS, sortable: false },
  ];

  // Render function for table rows
  const renderRow = (post) => (
    <tr key={post.post_id}>
      <td className={styles.idCell}>{post.post_id}</td>
      <td>
        <div className={styles.postInfo}>
          <strong className={styles.postTitle}>{post.post_title}</strong>
          {post.post_excerpt && (
            <span className={styles.postExcerpt}>
              {post.post_excerpt.length > 60
                ? `${post.post_excerpt.substring(0, 60)}...`
                : post.post_excerpt}
            </span>
          )}
        </div>
      </td>
      <td>
        <span className={styles.authorName}>
          {post.author?.user_firstname || post.author?.user_nickname || "Unknown"}
        </span>
      </td>
      <td>
        <button
          onClick={() => handleStatusToggle(post)}
          className={`${styles.statusBadge} ${
            post.post_status === "published"
              ? styles.statusPublished
              : styles.statusDraft
          }`}
          title={`Click to ${post.post_status === "published" ? "unpublish" : "publish"}`}
        >
          {post.post_status === "published"
            ? POST_LABELS.STATUS.PUBLISHED
            : POST_LABELS.STATUS.DRAFT}
        </button>
      </td>
      <td>
        {post.post_publish_date
          ? formatDateDMY(post.post_publish_date)
          : "—"}
      </td>
      <td className={styles.viewsCell}>
        <span className={styles.viewCount}>👁️ {post.post_view_count || 0}</span>
      </td>
      <td>{formatDateDMY(post.created_at)}</td>
      <td>
        <div className={viewStyles.actions}>
          <EditBtn onClick={() => handleEditPost(post)} title="Edit post" />
          <DeleteBtn onClick={() => handleDeletePost(post)} title="Delete post" />
        </div>
      </td>
    </tr>
  );

  return (
    <AdminManagementView
      // Page configuration
      pageType={ADMIN_PAGE_TYPES.POSTS}
      title={POST_LABELS.PAGE_TITLE}
      headerAction={<AddBtn onClick={handleOpenCreateModal}>+ {POST_LABELS.BUTTONS.CREATE_POST}</AddBtn>}
      // Search and filter props
      searchValue={filters.search}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFilterChange={handleFilterChange}
      // Loading and error states
      loading={loading}
      error={error}
      loadingText={POST_LABELS.MESSAGES.LOADING}
      // Data and pagination
      data={posts}
      pagination={pagination}
      onPageChange={handlePageChange}
      // Empty state
      emptyMessage={POST_LABELS.MESSAGES.NO_POSTS}
      emptyHint={
        <AddBtn onClick={handleOpenCreateModal}>Create Your First Post</AddBtn>
      }
      // Table configuration
      columns={columns}
      renderRow={renderRow}
      // Sorting
      sortConfig={sortConfig}
      onSort={handleSort}
    >
      {/* Post Edit/Create Modal */}
      <PostEditModal
        post={selectedPost}
        isOpen={isEditModalOpen}
        isCreateMode={isCreateMode}
        onClose={handleCloseEditModal}
        onSave={handlePostSaved}
      />

      {/* Delete Post Modal */}
      <DeletePostModal
        post={postToDelete}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Admin Alert Modal for Confirmations */}
      <AdminAlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        onConfirm={alertModal.onConfirm}
        type={alertModal.config.type}
        title={alertModal.config.title}
        message={alertModal.config.message}
        confirmText={alertModal.config.confirmText}
        cancelText={alertModal.config.cancelText}
        showCancel={alertModal.config.showCancel !== false}
        icon={alertModal.config.icon}
        isLoading={alertModal.isLoading}
      />
    </AdminManagementView>
  );
}
