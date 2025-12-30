///////////////////////////////////////////////////////////////////////
// ======================= REVIEW ROUTES ============================ //
///////////////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// User routes
router.post('/', requireAuth, reviewController.createOrUpdateReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/user/:userId', requireAuth, reviewController.getUserReviews);
router.put('/:reviewId', requireAuth, reviewController.editReview);
router.delete('/:reviewId', requireAuth, reviewController.deleteReview);

module.exports = router;
