///////////////////////////////////////////////////////////////////////
// ================ POST FEED SERVICE (SEQUELIZE) ================== //
///////////////////////////////////////////////////////////////////////

// This service handles public post feed operations
// Used for displaying posts on the homepage

// ======= Module Imports ======= //
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const { Post, User } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== getPublishedPosts Function ===== //
// Retrieves published posts for public display

const getPublishedPosts = async (options = {}) => {
  const { page = 1, limit = 3, sortBy = "post_publish_date", sortOrder = "DESC" } = options;
  const offset = (page - 1) * limit;

  const { count, rows } = await Post.findAndCountAll({
    where: {
      post_status: "published",
      post_publish_date: {
        [Op.lte]: new Date(), // Only posts with publish date in the past
      },
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "user_firstname", "user_lastname", "user_nickname", "user_avatar"],
      },
    ],
    order: [[sortBy, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    posts: rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      itemsPerPage: parseInt(limit),
      hasNextPage: page * limit < count,
      hasPrevPage: page > 1,
    },
  };
};

// ===== getPostBySlug Function ===== //
// Retrieves a single published post by its slug

const getPostBySlug = async (slug) => {
  const post = await Post.findOne({
    where: {
      post_slug: slug,
      post_status: "published",
      post_publish_date: {
        [Op.lte]: new Date(),
      },
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "user_firstname", "user_lastname", "user_nickname", "user_avatar"],
      },
    ],
  });

  return post;
};

// ===== getPostById Function ===== //
// Retrieves a single published post by its ID

const getPostById = async (postId) => {
  const post = await Post.findOne({
    where: {
      post_id: postId,
      post_status: "published",
      post_publish_date: {
        [Op.lte]: new Date(),
      },
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "user_firstname", "user_lastname", "user_nickname", "user_avatar"],
      },
    ],
  });

  return post;
};

// ===== incrementViewCount Function ===== //
// Increments the view count for a post

const incrementViewCount = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  await post.increment("post_view_count", { by: 1 });
  return post.post_view_count + 1;
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
