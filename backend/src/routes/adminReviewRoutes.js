///////////////////////////////////////////////////////////////////////
// =================== ADMIN REVIEW ROUTES ========================= //
///////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const adminReviewController = require("../controllers/adminReviewController");
const { requireAdmin } = require("../middleware/adminMiddleware");

// GET all reviews (with filters)
router.get("/admin/reviews", requireAdmin, adminReviewController.getAllReviews);

// GET rating breakdown by product
router.get("/admin/reviews/product/:productId/breakdown", requireAdmin, adminReviewController.getRatingBreakdown);

// GET a single review by ID
router.get("/admin/reviews/:reviewId", requireAdmin, adminReviewController.getReviewById);

// PUT update a review
router.put("/admin/reviews/:reviewId", requireAdmin, adminReviewController.updateReview);

// PATCH approve a review
router.patch("/admin/reviews/:reviewId/approve", requireAdmin, adminReviewController.approveReview);

// DELETE a review
router.delete("/admin/reviews/:reviewId", requireAdmin, adminReviewController.deleteReview);

module.exports = router;
