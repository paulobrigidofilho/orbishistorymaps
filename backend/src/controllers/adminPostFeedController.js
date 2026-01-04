///////////////////////////////////////////////////////////////////////
// ================ ADMIN POST FEED CONTROLLER ===================== //
///////////////////////////////////////////////////////////////////////

// This controller handles HTTP requests for admin post management
// Full CRUD operations for blog posts

// ======= Module Imports ======= //
const path = require("path");

// ======= Service Imports ======= //
const adminPostFeedService = require("../services/adminPostFeedService");

// ======= Helper Imports ======= //
const { compressPostImage } = require("../helpers/compressPostImage");

///////////////////////////////////////////////////////////////////////
// ================ CONTROLLER FUNCTIONS =========================== //
///////////////////////////////////////////////////////////////////////

// ===== getAllPosts Function ===== //
// HTTP handler to retrieve all posts for admin

const getAllPosts = async (req, res) => {
  try {
    const { page, limit, status, search, sortBy, sortOrder } = req.query;
    const result = await adminPostFeedService.getAllPosts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      search,
      sortBy: sortBy || "created_at",
      sortOrder: sortOrder || "DESC",
    });
    res.json(result);
  } catch (error) {
    console.error("Error in getAllPosts controller:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// ===== getPostById Function ===== //
// HTTP handler to retrieve a single post by ID

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await adminPostFeedService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// ===== createPost Function ===== //
// HTTP handler to create a new post

const createPost = async (req, res) => {
  try {
    const authorId = req.session?.user?.id || req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const post = await adminPostFeedService.createPost(req.body, authorId);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// ===== updatePost Function ===== //
// HTTP handler to update an existing post

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await adminPostFeedService.updatePost(postId, req.body);
    res.json(post);
  } catch (error) {
    console.error("Error in updatePost controller:", error);
    if (error.message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
};

// ===== deletePost Function ===== //
// HTTP handler to delete a post

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await adminPostFeedService.deletePost(postId);
    res.json(result);
  } catch (error) {
    console.error("Error in deletePost controller:", error);
    if (error.message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// ===== togglePostStatus Function ===== //
// HTTP handler to toggle post status

const togglePostStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await adminPostFeedService.togglePostStatus(postId);
    res.json(post);
  } catch (error) {
    console.error("Error in togglePostStatus controller:", error);
    if (error.message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to toggle post status" });
  }
};

// ===== getPostStats Function ===== //
// HTTP handler to get post statistics

const getPostStats = async (req, res) => {
  try {
    const stats = await adminPostFeedService.getPostStats();
    res.json(stats);
  } catch (error) {
    console.error("Error in getPostStats controller:", error);
    res.status(500).json({ error: "Failed to fetch post stats" });
  }
};

// ===== uploadPostImage Function ===== //
// HTTP handler to upload a post image with compression

const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Get the absolute path to the uploaded file
    const absolutePath = path.resolve(__dirname, "../../uploads/posts", req.file.filename);

    // Compress the image to multiple sizes
    const compressionResult = await compressPostImage(absolutePath);
    const primaryFilename = compressionResult.primaryFilename;

    // Construct URL for the large (primary) image
    const base = process.env.BACKEND_PUBLIC_URL?.replace(/\/+$/, "") || "http://localhost:4000";
    const imageUrl = `${base}/uploads/posts/${primaryFilename}`;

    console.log("[uploadPostImage] Image compressed successfully:", primaryFilename);

    res.json({
      imageUrl,
      sizes: compressionResult.images,
    });
  } catch (error) {
    console.error("Error in uploadPostImage controller:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  getPostStats,
  uploadPostImage,
};
