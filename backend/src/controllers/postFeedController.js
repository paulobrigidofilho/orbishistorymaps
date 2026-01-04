///////////////////////////////////////////////////////////////////////
// ================ POST FEED CONTROLLER =========================== //
///////////////////////////////////////////////////////////////////////

// This controller handles HTTP requests for public post feed
// Used for displaying posts on the homepage

// ======= Service Imports ======= //
const postFeedService = require("../services/postFeedService");

///////////////////////////////////////////////////////////////////////
// ================ CONTROLLER FUNCTIONS =========================== //
///////////////////////////////////////////////////////////////////////

// ===== getPublishedPosts Function ===== //
// HTTP handler to retrieve published posts

const getPublishedPosts = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await postFeedService.getPublishedPosts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 3,
      sortBy: sortBy || "post_publish_date",
      sortOrder: sortOrder || "DESC",
    });
    res.json(result);
  } catch (error) {
    console.error("Error in getPublishedPosts controller:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// ===== getPostBySlug Function ===== //
// HTTP handler to retrieve a single post by slug

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await postFeedService.getPostBySlug(slug);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error in getPostBySlug controller:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// ===== getPostById Function ===== //
// HTTP handler to retrieve a single post by ID

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postFeedService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// ===== incrementViewCount Function ===== //
// HTTP handler to increment view count for a post

const incrementViewCount = async (req, res) => {
  try {
    const { postId } = req.params;
    const newCount = await postFeedService.incrementViewCount(postId);
    res.json({ viewCount: newCount });
  } catch (error) {
    console.error("Error in incrementViewCount controller:", error);
    if (error.message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update view count" });
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getPublishedPosts,
  getPostBySlug,
  getPostById,
  incrementViewCount,
};
