///////////////////////////////////////////////////////////////////////
// ================ ADMIN REVIEW SERVICE (SEQUELIZE) =============== //
///////////////////////////////////////////////////////////////////////

// This service handles admin review management operations

// ======= Module Imports ======= //
const { Op, fn, col, literal } = require("sequelize");

// ======= Model Imports ======= //
const { ProductReview, User, Product } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// Get all reviews with filters
const getAllReviews = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    status = "all",
    sortBy = "created_at",
    sortOrder = "desc",
  } = filters;

  const whereConditions = {};

  if (status === "approved") {
    whereConditions.is_approved = true;
  } else if (status === "pending") {
    whereConditions.is_approved = false;
  }

  // Validate sort parameters
  const allowedSortFields = ["created_at", "rating", "is_approved"];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
  const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;

  const { count, rows } = await ProductReview.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["user_id", "user_email", "user_firstname", "user_lastname", "user_nickname"],
      },
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "product_name", "product_slug"],
      },
    ],
    order: [[validSortBy, validSortOrder]],
    limit: limit,
    offset: offset,
  });

  return {
    reviews: rows.map((r) => r.toJSON()),
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Get a single review by ID
const getReviewById = async (reviewId) => {
  const review = await ProductReview.findByPk(reviewId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["user_id", "user_email", "user_firstname", "user_lastname", "user_nickname"],
      },
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "product_name", "product_slug"],
      },
    ],
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review.toJSON();
};

// Update a review (admin) - also updates product rating stats if approval changed
const updateReview = async (reviewId, data) => {
  const review = await ProductReview.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const productId = review.product_id;

  await review.update(data);

  // Update product rating stats
  await updateProductRatingStats(productId);

  return review.toJSON();
};

// Approve/unapprove a review - also updates product rating stats
const approveReview = async (reviewId, isApproved) => {
  const review = await ProductReview.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const productId = review.product_id;

  await review.update({ is_approved: isApproved });

  // Update product rating stats
  await updateProductRatingStats(productId);

  return review.toJSON();
};

// Delete a review - also updates product rating stats
const deleteReview = async (reviewId) => {
  const review = await ProductReview.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  const productId = review.product_id;

  await review.destroy();

  // Update product rating stats
  await updateProductRatingStats(productId);

  return { reviewId, deleted: true };
};

// Get rating breakdown by product
const getRatingBreakdown = async (productId) => {
  const reviews = await ProductReview.findAll({
    where: {
      product_id: productId,
      is_approved: true,
    },
    attributes: ["rating"],
  });

  // Initialize breakdown
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  reviews.forEach((review) => {
    breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    totalRating += review.rating;
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  return {
    breakdown,
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};

// Update product rating stats (helper function)
const updateProductRatingStats = async (productId) => {
  try {
    const stats = await ProductReview.findOne({
      where: {
        product_id: productId,
        is_approved: true,
      },
      attributes: [
        [fn("AVG", col("rating")), "avg_rating"],
        [fn("COUNT", col("review_id")), "review_count"],
      ],
      raw: true,
    });

    await Product.update(
      {
        average_rating: stats.avg_rating || 0,
        review_count: stats.review_count || 0,
      },
      { where: { product_id: productId } }
    );

    console.log(`[adminReviewService] Updated rating stats for product ${productId}`);
  } catch (error) {
    console.error("Error updating product rating stats:", error);
  }
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllReviews,
  getReviewById,
  updateReview,
  approveReview,
  deleteReview,
  getRatingBreakdown,
};
