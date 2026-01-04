///////////////////////////////////////////////////////////////////////
// ================== ADMIN POSTS CONSTANTS ========================= //
///////////////////////////////////////////////////////////////////////

// This file contains constants for the AdminPosts page

///////////////////////////////////////////////////////////////////////
// ================== API ENDPOINTS ================================= //
///////////////////////////////////////////////////////////////////////

export const POST_API = {
  GET_ALL: "/api/admin/posts",
  GET_BY_ID: (id) => `/api/admin/posts/${id}`,
  CREATE: "/api/admin/posts",
  UPDATE: (id) => `/api/admin/posts/${id}`,
  DELETE: (id) => `/api/admin/posts/${id}`,
  TOGGLE_STATUS: (id) => `/api/admin/posts/${id}/toggle-status`,
  UPLOAD_IMAGE: "/api/admin/posts/upload-image",
  GET_STATS: "/api/admin/posts/stats",
};

///////////////////////////////////////////////////////////////////////
// ================== UI LABELS ===================================== //
///////////////////////////////////////////////////////////////////////

export const POST_LABELS = {
  PAGE_TITLE: "Post Management",
  PAGE_DESCRIPTION: "Create and manage blog posts",
  
  // Table headers
  TABLE_HEADERS: {
    TITLE: "Title",
    AUTHOR: "Author",
    STATUS: "Status",
    PUBLISH_DATE: "Publish Date",
    VIEWS: "Views",
    ACTIONS: "Actions",
  },
  
  // Status labels
  STATUS: {
    PUBLISHED: "Published",
    DRAFT: "Draft",
  },
  
  // Button labels
  BUTTONS: {
    CREATE_POST: "Create Post",
    EDIT: "Edit",
    DELETE: "Delete",
    VIEW: "View",
    PUBLISH: "Publish",
    UNPUBLISH: "Unpublish",
    SAVE: "Save Post",
    CANCEL: "Cancel",
  },
  
  // Form labels
  FORM: {
    TITLE: "Post Title",
    TITLE_PLACEHOLDER: "Enter post title...",
    CONTENT: "Content (Markdown supported)",
    CONTENT_PLACEHOLDER: "Write your post content here...",
    EXCERPT: "Excerpt",
    EXCERPT_PLACEHOLDER: "Brief description for preview cards...",
    IMAGE_URL: "Header Image",
    PUBLISH_DATE: "Publish Date",
    STATUS: "Status",
    SEO_DESCRIPTION: "SEO Description",
    SEO_DESCRIPTION_PLACEHOLDER: "Meta description for search engines (max 160 chars)",
    SEO_KEYWORDS: "SEO Keywords",
    SEO_KEYWORDS_PLACEHOLDER: "Comma-separated keywords",
  },
  
  // Messages
  MESSAGES: {
    LOADING: "Loading posts...",
    NO_POSTS: "No posts found. Create your first post!",
    CREATE_SUCCESS: "Post created successfully!",
    UPDATE_SUCCESS: "Post updated successfully!",
    DELETE_SUCCESS: "Post deleted successfully!",
    STATUS_CHANGED: "Post status updated!",
    CONFIRM_DELETE: "Are you sure you want to delete this post?",
    ERROR_LOADING: "Failed to load posts",
    ERROR_SAVING: "Failed to save post",
    ERROR_DELETING: "Failed to delete post",
  },
};

///////////////////////////////////////////////////////////////////////
// ================== FILTER OPTIONS ================================ //
///////////////////////////////////////////////////////////////////////

export const POST_FILTERS = {
  STATUS_OPTIONS: [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ],
  
  SORT_OPTIONS: [
    { value: "created_at", label: "Date Created" },
    { value: "post_publish_date", label: "Publish Date" },
    { value: "post_title", label: "Title" },
    { value: "post_view_count", label: "Views" },
  ],
};

///////////////////////////////////////////////////////////////////////
// ================== PAGINATION DEFAULTS =========================== //
///////////////////////////////////////////////////////////////////////

export const POST_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50],
};
