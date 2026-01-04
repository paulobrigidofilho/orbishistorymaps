///////////////////////////////////////////////////////////////////////
// =================== ADMIN REVIEW CONTROLLER ====================== //
///////////////////////////////////////////////////////////////////////

const adminReviewService = require("../services/adminReviewService");

// Get all reviews (with filters)
exports.getAllReviews = async (req, res) => {
	try {
		const filters = {
			page: parseInt(req.query.page) || 1,
			limit: parseInt(req.query.limit) || 20,
			status: req.query.status || "all",
			sortBy: req.query.sortBy || "created_at",
			sortOrder: req.query.sortOrder || "desc",
		};
		const result = await adminReviewService.getAllReviews(filters);
		res.json(result);
	} catch (err) {
		console.error("Error getting all reviews:", err);
		res.status(500).json({ error: err.message });
	}
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
	try {
		const review = await adminReviewService.getReviewById(req.params.reviewId);
		res.json(review);
	} catch (err) {
		if (err.message === "Review not found") {
			return res.status(404).json({ error: "Review not found" });
		}
		console.error("Error getting review:", err);
		res.status(500).json({ error: err.message });
	}
};

// Update a review
exports.updateReview = async (req, res) => {
	try {
		const result = await adminReviewService.updateReview(req.params.reviewId, req.body);
		res.json({ success: true, review: result });
	} catch (err) {
		console.error("Error updating review:", err);
		res.status(500).json({ error: err.message });
	}
};

// Approve/unapprove a review
exports.approveReview = async (req, res) => {
	try {
		const isApproved = req.body.is_approved;
		const result = await adminReviewService.approveReview(req.params.reviewId, isApproved);
		res.json({ success: true, review: result });
	} catch (err) {
		console.error("Error approving review:", err);
		res.status(500).json({ error: err.message });
	}
};

// Delete a review
exports.deleteReview = async (req, res) => {
	try {
		await adminReviewService.deleteReview(req.params.reviewId);
		res.json({ success: true });
	} catch (err) {
		console.error("Error deleting review:", err);
		res.status(500).json({ error: err.message });
	}
};

// Get rating breakdown by product
exports.getRatingBreakdown = async (req, res) => {
	try {
		const breakdown = await adminReviewService.getRatingBreakdown(req.params.productId);
		res.json(breakdown);
	} catch (err) {
		console.error("Error getting rating breakdown:", err);
		res.status(500).json({ error: err.message });
	}
};
