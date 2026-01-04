///////////////////////////////////////////////////////////////////////
// ======================= REVIEW ROUTES ============================ //
///////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public routes - no auth required (must be first)
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/breakdown', reviewController.getRatingBreakdown);

// User routes - require authentication
router.post('/', requireAuth, reviewController.createOrUpdateReview);
router.get('/user/:userId', requireAuth, reviewController.getUserReviews);
router.put('/:reviewId', requireAuth, reviewController.editReview);
router.delete('/:reviewId', requireAuth, reviewController.deleteReview);

// Admin routes
router.get('/', requireAdmin, reviewController.adminGetReviews);

module.exports = router;
