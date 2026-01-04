///////////////////////////////////////////////////////////////////////
// ================ ADMIN POST FEED SERVICE (SEQUELIZE) ============ //
///////////////////////////////////////////////////////////////////////

// This service handles admin post management operations
// Full CRUD operations for blog posts

// ======= Module Imports ======= //
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// ======= Model Imports ======= //
const { Post, User } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ HELPER FUNCTIONS =============================== //
///////////////////////////////////////////////////////////////////////

// ===== generateSlug Function ===== //
// Creates a URL-friendly slug from a title

const generateSlug = (title) => {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${slug}-${timestamp}`;
};

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== getAllPosts Function ===== //
// Retrieves all posts for admin with filtering and pagination

const getAllPosts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = "created_at",
    sortOrder = "DESC",
  } = options;
  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {};

  if (status && status !== "all") {
    if (status === "scheduled") {
      // Scheduled posts: published status with future date
      whereClause.post_status = "published";
      whereClause.post_publish_date = { [Op.gt]: new Date() };
    } else if (status === "published") {
      // True published posts: published status with past/current date or null
      whereClause.post_status = "published";
      whereClause[Op.or] = [
        { post_publish_date: null },
        { post_publish_date: { [Op.lte]: new Date() } }
      ];
    } else {
      // Draft or any other status
      whereClause.post_status = status;
    }
  }

  if (search) {
    // Use Op.and to combine with existing conditions
    const searchCondition = {
      [Op.or]: [
        { post_title: { [Op.like]: `%${search}%` } },
        { post_content: { [Op.like]: `%${search}%` } },
      ]
    };
    
    // If whereClause already has Op.or (from published filter), wrap in Op.and
    if (whereClause[Op.or]) {
      const existingOr = whereClause[Op.or];
      delete whereClause[Op.or];
      Object.assign(whereClause, {
        [Op.and]: [
          { [Op.or]: existingOr },
          searchCondition
        ]
      });
    } else {
      Object.assign(whereClause, searchCondition);
    }
  }

  const { count, rows } = await Post.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "author",
        attributes: ["user_id", "user_firstname", "user_lastname", "user_nickname"],
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

// ===== getPostById Function ===== //
// Retrieves a single post by ID (admin - includes drafts)

const getPostById = async (postId) => {
  const post = await Post.findByPk(postId, {
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

// ===== createPost Function ===== //
// Creates a new post

const createPost = async (postData, authorId) => {
  // Support both naming conventions (frontend uses post_* format)
  const title = postData.post_title || postData.title;
  const content = postData.post_content || postData.content;
  const excerpt = postData.post_excerpt || postData.excerpt;
  const imageUrl = postData.post_image_url || postData.imageUrl;
  const publishDate = postData.post_publish_date || postData.publishDate;
  const status = postData.post_status || postData.status;
  const seoDescription = postData.seo_description || postData.seoDescription;
  const seoKeywords = postData.seo_keywords || postData.seoKeywords;

  if (!title) {
    throw new Error("Post title is required");
  }
  if (!content) {
    throw new Error("Post content is required");
  }

  const post = await Post.create({
    post_id: uuidv4(),
    post_title: title,
    post_slug: generateSlug(title),
    post_content: content,
    post_excerpt: excerpt || content.substring(0, 200).replace(/[#*_`]/g, "") + "...",
    post_image_url: imageUrl || null,
    post_publish_date: publishDate || (status === "published" ? new Date() : null),
    post_status: status || "draft",
    seo_description: seoDescription || null,
    seo_keywords: seoKeywords || null,
    author_id: authorId,
  });

  return post;
};

// ===== updatePost Function ===== //
// Updates an existing post

const updatePost = async (postId, postData) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  // Support both naming conventions (frontend uses post_* format)
  const title = postData.post_title || postData.title;
  const content = postData.post_content || postData.content;
  const excerpt = postData.post_excerpt || postData.excerpt;
  const imageUrl = postData.post_image_url !== undefined ? postData.post_image_url : postData.imageUrl;
  const publishDate = postData.post_publish_date !== undefined ? postData.post_publish_date : postData.publishDate;
  const status = postData.post_status || postData.status;
  const seoDescription = postData.seo_description !== undefined ? postData.seo_description : postData.seoDescription;
  const seoKeywords = postData.seo_keywords !== undefined ? postData.seo_keywords : postData.seoKeywords;

  // If title changed, regenerate slug
  const newSlug = title && title !== post.post_title ? generateSlug(title) : post.post_slug;

  await post.update({
    post_title: title || post.post_title,
    post_slug: newSlug,
    post_content: content || post.post_content,
    post_excerpt: excerpt || post.post_excerpt,
    post_image_url: imageUrl !== undefined ? imageUrl : post.post_image_url,
    post_publish_date: publishDate !== undefined ? publishDate : post.post_publish_date,
    post_status: status || post.post_status,
    seo_description: seoDescription !== undefined ? seoDescription : post.seo_description,
    seo_keywords: seoKeywords !== undefined ? seoKeywords : post.seo_keywords,
  });

  return post;
};

// ===== deletePost Function ===== //
// Deletes a post

const deletePost = async (postId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  await post.destroy();
  return { message: "Post deleted successfully" };
};

// ===== togglePostStatus Function ===== //
// Toggles post status between draft and published

const togglePostStatus = async (postId) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const newStatus = post.post_status === "draft" ? "published" : "draft";
  const publishDate = newStatus === "published" && !post.post_publish_date ? new Date() : post.post_publish_date;

  await post.update({
    post_status: newStatus,
    post_publish_date: publishDate,
  });

  return post;
};

// ===== getPostStats Function ===== //
// Gets post statistics for dashboard

const getPostStats = async () => {
  const { Op } = require("sequelize");
  
  const totalPosts = await Post.count();
  
  // Truly published posts (published and date is now or past)
  const publishedPosts = await Post.count({
    where: {
      post_status: "published",
      [Op.or]: [
        { post_publish_date: null },
        { post_publish_date: { [Op.lte]: new Date() } }
      ]
    }
  });
  
  // Scheduled posts (published but date is in future)
  const scheduledPosts = await Post.count({
    where: {
      post_status: "published",
      post_publish_date: { [Op.gt]: new Date() }
    }
  });
  
  const draftPosts = await Post.count({ where: { post_status: "draft" } });
  const totalViews = await Post.sum("post_view_count") || 0;

  return {
    totalPosts,
    publishedPosts,
    scheduledPosts,
    draftPosts,
    totalViews,
  };
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
};
