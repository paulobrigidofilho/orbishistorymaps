///////////////////////////////////////////////////////////////////////
// ================ REVIEW SERVICE (SEQUELIZE) ===================== //
///////////////////////////////////////////////////////////////////////

// This service handles product review business logic using Sequelize ORM
// Provides review CRUD operations and rating management

// ======= Module Imports ======= //
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const {
  ProductReview,
  Product,
  User,
  Order,
  sequelize,
} = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Create Or Update Review ===== //
const createOrUpdateReview = async (userId, reviewData) => {
  try {
    const { product_id, rating, review_title, review_text, order_id } = reviewData;

    // Check for existing review
    const existing = await ProductReview.findOne({
      where: { user_id: userId, product_id },
    });

    if (existing) {
      // Update existing review
      await existing.update({
        rating,
        review_title,
        review_text,
        is_approved: false, // Reset approval on edit
      });
      return { updated: true };
    }

    // Create new review
    await ProductReview.create({
      review_id: uuidv4(),
      product_id,
      user_id: userId,
      order_id,
      rating,
      review_title,
      review_text,
      is_verified_purchase: !!order_id,
      is_approved: false,
      helpful_count: 0,
    });

    return { created: true };
  } catch (error) {
    console.error("Error in createOrUpdateReview:", error);
    throw error;
  }
};

// ===== Get Reviews By Product ===== //
const getReviewsByProduct = async (productId) => {
  try {
    const reviews = await ProductReview.findAll({
      where: { product_id: productId, is_approved: true },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_nickname", "user_avatar"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return reviews.map((r) => {
      const review = r.get({ plain: true });
      return {
        ...review,
        user_nickname: review.user?.user_nickname,
        user_avatar: review.user?.user_avatar,
        user: undefined,
      };
    });
  } catch (error) {
    console.error("Error in getReviewsByProduct:", error);
    throw error;
  }
};

// ===== Get Reviews By User ===== //
const getReviewsByUser = async (userId) => {
  try {
    const reviews = await ProductReview.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name", "product_slug"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return reviews.map((r) => {
      const review = r.get({ plain: true });
      return {
        ...review,
        product_name: review.product?.product_name,
        product_slug: review.product?.product_slug,
        product: undefined,
      };
    });
  } catch (error) {
    console.error("Error in getReviewsByUser:", error);
    throw error;
  }
};

// ===== Get Review By ID ===== //
const getReviewById = async (reviewId) => {
  try {
    const review = await ProductReview.findByPk(reviewId);
    return review ? review.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error in getReviewById:", error);
    throw error;
  }
};

// ===== Update Review ===== //
const updateReview = async (reviewId, updateData) => {
  try {
    const [affectedRows] = await ProductReview.update(updateData, {
      where: { review_id: reviewId },
    });
    return { affectedRows };
  } catch (error) {
    console.error("Error in updateReview:", error);
    throw error;
  }
};

// ===== Delete Review ===== //
const deleteReview = async (reviewId) => {
  try {
    const affectedRows = await ProductReview.destroy({
      where: { review_id: reviewId },
    });
    return { affectedRows };
  } catch (error) {
    console.error("Error in deleteReview:", error);
    throw error;
  }
};

// ===== Set Approval Status ===== //
const setApprovalStatus = async (reviewId, isApproved) => {
  try {
    const [affectedRows] = await ProductReview.update(
      { is_approved: isApproved },
      { where: { review_id: reviewId } }
    );
    return { affectedRows };
  } catch (error) {
    console.error("Error in setApprovalStatus:", error);
    throw error;
  }
};

// ===== Get Rating Breakdown ===== //
const getRatingBreakdown = async (productId) => {
  try {
    const result = await ProductReview.findAll({
      where: { product_id: productId, is_approved: true },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("review_id")), "totalReviews"],
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN rating = 5 THEN 1 ELSE 0 END")
          ),
          "star5",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN rating = 4 THEN 1 ELSE 0 END")
          ),
          "star4",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN rating = 3 THEN 1 ELSE 0 END")
          ),
          "star3",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN rating = 2 THEN 1 ELSE 0 END")
          ),
          "star2",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN rating = 1 THEN 1 ELSE 0 END")
          ),
          "star1",
        ],
      ],
      raw: true,
    });

    const row = result[0] || {};
    return {
      totalReviews: parseInt(row.totalReviews) || 0,
      averageRating: parseFloat(row.averageRating) || 0,
      breakdown: {
        5: parseInt(row.star5) || 0,
        4: parseInt(row.star4) || 0,
        3: parseInt(row.star3) || 0,
        2: parseInt(row.star2) || 0,
        1: parseInt(row.star1) || 0,
      },
    };
  } catch (error) {
    console.error("Error in getRatingBreakdown:", error);
    throw error;
  }
};

// ===== Update Product Rating Stats ===== //
const updateProductRatingStats = async (productId) => {
  try {
    const result = await ProductReview.findAll({
      where: { product_id: productId, is_approved: true },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("review_id")), "count"],
      ],
      raw: true,
    });

    const stats = result[0] || {};
    await Product.update(
      {
        rating_average: parseFloat(stats.avgRating) || 0,
        rating_count: parseInt(stats.count) || 0,
      },
      { where: { product_id: productId } }
    );

    return { success: true };
  } catch (error) {
    console.error("Error in updateProductRatingStats:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ LEGACY CALLBACK WRAPPERS ======================= //
///////////////////////////////////////////////////////////////////////

const reviewServiceLegacy = {
  createOrUpdateReview: (userId, reviewData, callback) => {
    createOrUpdateReview(userId, reviewData)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  getReviewsByProduct: (productId, callback) => {
    getReviewsByProduct(productId)
      .then((reviews) => callback(null, reviews))
      .catch((err) => callback(err, null));
  },

  getReviewsByUser: (userId, callback) => {
    getReviewsByUser(userId)
      .then((reviews) => callback(null, reviews))
      .catch((err) => callback(err, null));
  },

  getReviewById: (reviewId, callback) => {
    getReviewById(reviewId)
      .then((review) => callback(null, review))
      .catch((err) => callback(err, null));
  },

  updateReview: (reviewId, updateData, callback) => {
    updateReview(reviewId, updateData)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  deleteReview: (reviewId, callback) => {
    deleteReview(reviewId)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  setApprovalStatus: (reviewId, isApproved, callback) => {
    setApprovalStatus(reviewId, isApproved)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  getRatingBreakdown: (productId, callback) => {
    getRatingBreakdown(productId)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  updateProductRatingStats: (productId, callback) => {
    updateProductRatingStats(productId)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  // Async methods (recommended)
  createOrUpdateReview,
  getReviewsByProduct,
  getReviewsByUser,
  getReviewById,
  updateReview,
  deleteReview,
  setApprovalStatus,
  getRatingBreakdown,
  updateProductRatingStats,
};
