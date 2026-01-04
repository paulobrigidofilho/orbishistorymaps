///////////////////////////////////////////////////////////////////////
// ================ POST FEED ROUTES =============================== //
///////////////////////////////////////////////////////////////////////

// This file defines public routes for the post feed
// No authentication required for viewing published posts

// ======= Module Imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller Imports ======= //
const postFeedController = require("../controllers/postFeedController");

///////////////////////////////////////////////////////////////////////
// ================ ROUTE DEFINITIONS ============================== //
///////////////////////////////////////////////////////////////////////

// GET /api/posts - Get published posts with pagination
router.get("/", postFeedController.getPublishedPosts);

// GET /api/posts/slug/:slug - Get a single post by slug
router.get("/slug/:slug", postFeedController.getPostBySlug);

// GET /api/posts/:postId - Get a single post by ID
router.get("/:postId", postFeedController.getPostById);

// POST /api/posts/:postId/view - Increment view count
router.post("/:postId/view", postFeedController.incrementViewCount);

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = router;
