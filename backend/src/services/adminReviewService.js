///////////////////////////////////////////////////////////////////////
// =================== ADMIN REVIEW SERVICE ======================== //
///////////////////////////////////////////////////////////////////////

const reviewModel = require("../model/reviewModel");

// Get all reviews with filters
exports.getAllReviews = (filters = {}, callback) => {
	reviewModel.adminGetReviews(filters, callback);
};

// Get a single review by ID
exports.getReviewById = (reviewId, callback) => {
	// You may want to add a model method for this if needed
	// For now, fetch all and filter
	reviewModel.adminGetReviews({}, (err, reviews) => {
		if (err) return callback(err);
		const review = reviews.find(r => r.review_id === reviewId);
		callback(null, review);
	});
};

// Update a review (admin) - also updates product rating stats if approval changed
exports.updateReview = (reviewId, data, callback) => {
	// First get the review to know the product_id
	reviewModel.getReviewById(reviewId, (err, review) => {
		if (err) return callback(err);
		if (!review) return callback(new Error("Review not found"));
		
		reviewModel.updateReview(reviewId, data, (err, result) => {
			if (err) return callback(err);
			// Update product rating stats after review update
			reviewModel.updateProductRatingStats(review.product_id, (err2) => {
				if (err2) console.error("Error updating product rating stats:", err2);
				callback(null, result);
			});
		});
	});
};

// Approve/unapprove a review - also updates product rating stats
exports.approveReview = (reviewId, isApproved, callback) => {
	// First get the review to know the product_id
	reviewModel.getReviewById(reviewId, (err, review) => {
		if (err) return callback(err);
		if (!review) return callback(new Error("Review not found"));
		
		reviewModel.setApprovalStatus(reviewId, isApproved, (err, result) => {
			if (err) return callback(err);
			// Update product rating stats after approval change
			reviewModel.updateProductRatingStats(review.product_id, (err2) => {
				if (err2) console.error("Error updating product rating stats:", err2);
				callback(null, result);
			});
		});
	});
};

// Delete a review - also updates product rating stats
exports.deleteReview = (reviewId, callback) => {
	// First get the review to know the product_id
	reviewModel.getReviewById(reviewId, (err, review) => {
		if (err) return callback(err);
		if (!review) return callback(new Error("Review not found"));
		
		const productId = review.product_id;
		reviewModel.deleteReview(reviewId, (err, result) => {
			if (err) return callback(err);
			// Update product rating stats after deletion
			reviewModel.updateProductRatingStats(productId, (err2) => {
				if (err2) console.error("Error updating product rating stats:", err2);
				callback(null, result);
			});
		});
	});
};

// Get rating breakdown by product
exports.getRatingBreakdown = (productId, callback) => {
	reviewModel.getRatingBreakdown(productId, callback);
};
