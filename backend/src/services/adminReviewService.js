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

// Update a review (admin)
exports.updateReview = (reviewId, data, callback) => {
	reviewModel.updateReview(reviewId, data, callback);
};

// Approve a review
exports.approveReview = (reviewId, callback) => {
	reviewModel.updateReview(reviewId, { is_approved: true }, callback);
};

// Delete a review
exports.deleteReview = (reviewId, callback) => {
	reviewModel.deleteReview(reviewId, callback);
};
