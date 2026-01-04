///////////////////////////////////////////////////////////////////////
// ======================= REVIEW CONTROLLER ======================== //
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Handles user review CRUD operations using Sequelize service
///////////////////////////////////////////////////////////////////////

const reviewService = require("../services/reviewService");
const { ProductReview, User, Product } = require("../models");
const { Op } = require("sequelize");

// Create or update a review (one per user/product)
exports.createOrUpdateReview = async (req, res) => {
  try {
    console.log("[REVIEW] createOrUpdateReview route hit");
    console.log("[REVIEW] session:", req.session);
    const { product_id, rating, review_title, review_text, order_id } = req.body;
    
    if (!req.session || !req.session.user) {
      console.error("[REVIEW] No session user found");
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user_id = req.session.user.id;
    const result = await reviewService.createOrUpdateReview(user_id, { 
      product_id, rating, review_title, review_text, order_id 
    });
    
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("[REVIEW] Error in createOrUpdateReview:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    res.json(reviews);
  } catch (error) {
    console.error("[REVIEW] Error in getProductReviews:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get rating breakdown for a product (public)
exports.getRatingBreakdown = async (req, res) => {
  try {
    const { productId } = req.params;
    const breakdown = await reviewService.getRatingBreakdown(productId);
    res.json(breakdown);
  } catch (error) {
    console.error("[REVIEW] Error in getRatingBreakdown:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all reviews by a user
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.json(reviews);
  } catch (error) {
    console.error("[REVIEW] Error in getUserReviews:", error);
    res.status(500).json({ error: error.message });
  }
};

// Edit a review
exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, review_title, review_text } = req.body;
    
    // First get the review to know the product_id for stats update
    const review = await reviewService.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    await reviewService.updateReview(reviewId, { 
      rating, 
      review_title, 
      review_text, 
      is_approved: review.is_approved 
    });
    
    // Update product rating stats
    await reviewService.updateProductRatingStats(review.product_id);
    
    res.json({ success: true });
  } catch (error) {
    console.error("[REVIEW] Error in editReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // First get the review to know the product_id for stats update
    const review = await reviewService.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    const productId = review.product_id;
    await reviewService.deleteReview(reviewId);
    
    // Update product rating stats
    await reviewService.updateProductRatingStats(productId);
    
    res.json({ success: true });
  } catch (error) {
    console.error("[REVIEW] Error in deleteReview:", error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: get all reviews
exports.adminGetReviews = async (req, res) => {
  try {
    const { productId, userId, rating } = req.query;
    
    // Build WHERE clause
    const whereConditions = {};
    
    if (productId) {
      whereConditions.product_id = productId;
    }
    if (userId) {
      whereConditions.user_id = userId;
    }
    if (rating) {
      whereConditions.rating = parseInt(rating);
    }
    
    const reviews = await ProductReview.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ["user_nickname", "user_email"],
        },
        {
          model: Product,
          attributes: ["product_name", "product_slug"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    
    const formattedReviews = reviews.map(r => {
      const review = r.get({ plain: true });
      return {
        ...review,
        user_nickname: review.User?.user_nickname,
        user_email: review.User?.user_email,
        product_name: review.Product?.product_name,
        product_slug: review.Product?.product_slug,
        User: undefined,
        Product: undefined,
      };
    });
    
    res.json(formattedReviews);
  } catch (error) {
    console.error("[REVIEW] Error in adminGetReviews:", error);
    res.status(500).json({ error: error.message });
  }
};
