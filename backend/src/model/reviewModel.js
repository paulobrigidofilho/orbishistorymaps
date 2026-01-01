///////////////////////////////////////////////////////////////////////
// ========================= REVIEW MODEL =========================== //
///////////////////////////////////////////////////////////////////////

const db = require("../config/config").db;

const reviewModel = {
  ///////////////////////////////////////////////////////////////////////
  // =================== CREATE REVIEW =============================== //
  ///////////////////////////////////////////////////////////////////////
  createReview: (reviewData, callback) => {
    const query = `
      INSERT INTO product_reviews (
        review_id, product_id, user_id, order_id, rating, review_title, review_text, is_verified_purchase, is_approved, helpful_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    db.execute(
      query,
      [
        reviewData.review_id,
        reviewData.product_id,
        reviewData.user_id,
        reviewData.order_id || null,
        reviewData.rating,
        reviewData.review_title || null,
        reviewData.review_text || null,
        reviewData.is_verified_purchase || false,
        reviewData.is_approved || false,
        reviewData.helpful_count || 0
      ],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET REVIEWS BY PRODUCT ====================== //
  ///////////////////////////////////////////////////////////////////////
  getReviewsByProduct: (productId, callback) => {
    const query = `
      SELECT r.*, u.user_nickname, u.user_avatar
      FROM product_reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ? AND r.is_approved = TRUE
      ORDER BY r.created_at DESC`;
    db.execute(query, [productId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET REVIEWS BY USER ========================= //
  ///////////////////////////////////////////////////////////////////////
  getReviewsByUser: (userId, callback) => {
    const query = `
      SELECT r.*, p.product_name
      FROM product_reviews r
      JOIN products p ON r.product_id = p.product_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC`;
    db.execute(query, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== UPDATE REVIEW =============================== //
  ///////////////////////////////////////////////////////////////////////
  updateReview: (reviewId, reviewData, callback) => {
    const query = `
      UPDATE product_reviews SET rating = ?, review_title = ?, review_text = ?, is_approved = ?, updated_at = NOW()
      WHERE review_id = ?`;
    db.execute(
      query,
      [reviewData.rating, reviewData.review_title, reviewData.review_text, reviewData.is_approved, reviewId],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== SET APPROVAL STATUS ========================= //
  ///////////////////////////////////////////////////////////////////////
  setApprovalStatus: (reviewId, isApproved, callback) => {
    const query = `UPDATE product_reviews SET is_approved = ?, updated_at = NOW() WHERE review_id = ?`;
    db.execute(query, [isApproved, reviewId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== DELETE REVIEW =============================== //
  ///////////////////////////////////////////////////////////////////////
  deleteReview: (reviewId, callback) => {
    const query = `DELETE FROM product_reviews WHERE review_id = ?`;
    db.execute(query, [reviewId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== ADMIN GET ALL REVIEWS ======================= //
  ///////////////////////////////////////////////////////////////////////
  adminGetReviews: (filters, callback) => {
    let query = `
      SELECT r.*, u.user_nickname, p.product_name
      FROM product_reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN products p ON r.product_id = p.product_id
      WHERE 1=1`;
    const params = [];
    if (filters.productId) {
      query += ` AND r.product_id = ?`;
      params.push(filters.productId);
    }
    if (filters.userId) {
      query += ` AND r.user_id = ?`;
      params.push(filters.userId);
    }
    if (filters.rating) {
      query += ` AND r.rating = ?`;
      params.push(filters.rating);
    }
    query += ` ORDER BY r.created_at DESC`;
    db.execute(query, params, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET RATING BREAKDOWN BY PRODUCT ============= //
  ///////////////////////////////////////////////////////////////////////
  getRatingBreakdown: (productId, callback) => {
    const query = `
      SELECT 
        COUNT(*) as totalReviews,
        AVG(rating) as averageRating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as star5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as star4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as star3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as star2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as star1
      FROM product_reviews
      WHERE product_id = ? AND is_approved = TRUE`;
    db.execute(query, [productId], (err, results) => {
      if (err) return callback(err, null);
      const row = results[0] || {};
      const breakdown = {
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
      callback(null, breakdown);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== UPDATE PRODUCT RATING STATS ================= //
  ///////////////////////////////////////////////////////////////////////
  updateProductRatingStats: (productId, callback) => {
    // Calculate average and count from approved reviews only
    const query = `
      UPDATE products p
      SET 
        rating_average = COALESCE((
          SELECT AVG(rating) FROM product_reviews 
          WHERE product_id = ? AND is_approved = TRUE
        ), 0),
        rating_count = (
          SELECT COUNT(*) FROM product_reviews 
          WHERE product_id = ? AND is_approved = TRUE
        )
      WHERE p.product_id = ?`;
    db.execute(query, [productId, productId, productId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // =================== GET REVIEW BY ID ============================ //
  ///////////////////////////////////////////////////////////////////////
  getReviewById: (reviewId, callback) => {
    const query = `SELECT * FROM product_reviews WHERE review_id = ?`;
    db.execute(query, [reviewId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0] || null);
    });
  }
};

module.exports = reviewModel;
