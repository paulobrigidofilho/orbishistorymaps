///////////////////////////////////////////////////////////////////////
// ======================= REVIEW CONTROLLER ======================== //
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Handles user review CRUD operations (raw SQL/callback)
///////////////////////////////////////////////////////////////////////

const reviewModel = require("../model/reviewModel");
const reviewService = require("../services/reviewService");

// Create or update a review (one per user/product)
exports.createOrUpdateReview = (req, res) => {
  console.log("[REVIEW] createOrUpdateReview route hit");
  console.log("[REVIEW] session:", req.session);
  const { product_id, rating, review_title, review_text, order_id } = req.body;
  if (!req.session || !req.session.user) {
    console.error("[REVIEW] No session user found");
    return res.status(401).json({ error: "Not authenticated" });
  }
  const user_id = req.session.user.id;
  reviewService.createOrUpdateReview(user_id, { product_id, rating, review_title, review_text, order_id }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ success: true, ...result });
  });
};

// Get all reviews for a product
exports.getProductReviews = (req, res) => {
  const { productId } = req.params;
  reviewModel.getReviewsByProduct(productId, (err, reviews) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reviews);
  });
};

// Get rating breakdown for a product (public)
exports.getRatingBreakdown = (req, res) => {
  const { productId } = req.params;
  reviewModel.getRatingBreakdown(productId, (err, breakdown) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(breakdown);
  });
};

// Get all reviews by a user
exports.getUserReviews = (req, res) => {
  const { userId } = req.params;
  reviewModel.getReviewsByUser(userId, (err, reviews) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reviews);
  });
};

// Edit a review
exports.editReview = (req, res) => {
  const { reviewId } = req.params;
  const { rating, review_title, review_text } = req.body;
  
  // First get the review to know the product_id for stats update
  reviewModel.getReviewById(reviewId, (err, review) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!review) return res.status(404).json({ error: "Review not found" });
    
    reviewModel.updateReview(
      reviewId,
      { rating, review_title, review_text, is_approved: review.is_approved },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        // Update product rating stats
        reviewModel.updateProductRatingStats(review.product_id, (err2) => {
          if (err2) console.error("Error updating product rating stats:", err2);
          res.json({ success: true });
        });
      }
    );
  });
};

// Delete a review
exports.deleteReview = (req, res) => {
  const { reviewId } = req.params;
  
  // First get the review to know the product_id for stats update
  reviewModel.getReviewById(reviewId, (err, review) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!review) return res.status(404).json({ error: "Review not found" });
    
    const productId = review.product_id;
    reviewModel.deleteReview(reviewId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      // Update product rating stats
      reviewModel.updateProductRatingStats(productId, (err2) => {
        if (err2) console.error("Error updating product rating stats:", err2);
        res.json({ success: true });
      });
    });
  });
};

// Admin: get all reviews
exports.adminGetReviews = (req, res) => {
  // Accept filters via query params
  const filters = {
    productId: req.query.productId,
    userId: req.query.userId,
    rating: req.query.rating,
  };
  reviewModel.adminGetReviews(filters, (err, reviews) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(reviews);
  });
};
