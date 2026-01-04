///////////////////////////////////////////////////////////////////////
// ================== POST FEED CONSTANTS =========================== //
///////////////////////////////////////////////////////////////////////

// This file contains constants for the PostFeed component

///////////////////////////////////////////////////////////////////////
// ================== API ENDPOINTS ================================= //
///////////////////////////////////////////////////////////////////////

export const POST_FEED_API = {
  GET_POSTS: "/api/posts",
  GET_POST_BY_SLUG: (slug) => `/api/posts/slug/${slug}`,
  GET_POST_BY_ID: (id) => `/api/posts/${id}`,
  INCREMENT_VIEW: (id) => `/api/posts/${id}/view`,
};

///////////////////////////////////////////////////////////////////////
// ================== DISPLAY SETTINGS ============================== //
///////////////////////////////////////////////////////////////////////

export const POST_FEED_SETTINGS = {
  INITIAL_POSTS: 3,
  POSTS_PER_LOAD: 3,
};

///////////////////////////////////////////////////////////////////////
// ================== UI LABELS ===================================== //
///////////////////////////////////////////////////////////////////////

export const POST_FEED_LABELS = {
  SECTION_TITLE: "Latest Updates",
  SECTION_SUBTITLE: "Stay informed with our latest news and announcements",
  LOAD_MORE: "Load More Posts",
  LOADING: "Loading posts...",
  NO_POSTS: "No posts available at this time.",
  READ_MORE: "Read More",
  READ_TIME: "min read",
  VIEWS: "views",
  ERROR_LOADING: "Unable to load posts. Please try again later.",
};

///////////////////////////////////////////////////////////////////////
// ================== PLACEHOLDER ================================== //
///////////////////////////////////////////////////////////////////////

export const POST_PLACEHOLDER_IMAGE = "/images/placeholder-post.jpg";
