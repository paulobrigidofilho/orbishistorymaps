///////////////////////////////////////////////////////////////////////
// ======================= REVIEW SERVICE =========================== //
///////////////////////////////////////////////////////////////////////

const reviewModel = require("../model/reviewModel");
const uuid = require("uuid");

// Create or update a review (one per user/product)
exports.createOrUpdateReview = (user_id, { product_id, rating, review_title, review_text, order_id }, callback) => {
	reviewModel.getReviewsByUser(user_id, (err, reviews) => {
		if (err) return callback(err);
		const existing = reviews.find((r) => r.product_id === product_id);
		if (existing) {
			// Update existing review
			reviewModel.updateReview(
				existing.review_id,
				{ rating, review_title, review_text },
				(err, result) => {
					if (err) return callback(err);
					callback(null, { updated: true });
				}
			);
		} else {
			// Create new review
			reviewModel.createReview(
				{
					review_id: uuid.v4(),
					product_id,
					user_id,
					order_id,
					rating,
					review_title,
					review_text,
					is_verified_purchase: !!order_id,
					is_approved: false,
					helpful_count: 0,
				},
				(err, result) => {
					if (err) return callback(err);
					callback(null, { created: true });
				}
			);
		}
	});
};

// Other service methods can be added here as needed (edit, delete, admin, etc)
