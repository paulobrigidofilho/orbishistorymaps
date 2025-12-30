///////////////////////////////////////////////////////////////////////
// =================== ADMIN REVIEW CONTROLLER ====================== //
///////////////////////////////////////////////////////////////////////

const adminReviewService = require("../services/adminReviewService");

// Get all reviews (with filters)
exports.getAllReviews = (req, res) => {
	const filters = {
		productId: req.query.productId,
		userId: req.query.userId,
		rating: req.query.rating,
	};
	adminReviewService.getAllReviews(filters, (err, reviews) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json(reviews);
	});
};

// Get a single review by ID
exports.getReviewById = (req, res) => {
	adminReviewService.getReviewById(req.params.reviewId, (err, review) => {
		if (err) return res.status(500).json({ error: err.message });
		if (!review) return res.status(404).json({ error: "Review not found" });
		res.json(review);
	});
};

// Update a review
exports.updateReview = (req, res) => {
	adminReviewService.updateReview(req.params.reviewId, req.body, (err, result) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ success: true });
	});
};

// Approve a review
exports.approveReview = (req, res) => {
	adminReviewService.approveReview(req.params.reviewId, (err, result) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ success: true });
	});
};

// Delete a review
exports.deleteReview = (req, res) => {
	adminReviewService.deleteReview(req.params.reviewId, (err, result) => {
		if (err) return res.status(500).json({ error: err.message });
		res.json({ success: true });
	});
};
