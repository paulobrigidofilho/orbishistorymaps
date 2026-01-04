///////////////////////////////////////////////////////////////////////
// ================ ADMIN STATS SERVICE (SEQUELIZE) ================ //
///////////////////////////////////////////////////////////////////////

// This service provides statistics for the admin dashboard

// ======= Module Imports ======= //
const { fn, col, Op } = require("sequelize");

// ======= Model Imports ======= //
const { User, Product, Order, ProductReview, Post } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== getStats Function ===== //
// Retrieves dashboard statistics

const getStats = async () => {
  // Run multiple queries in parallel using Promise.all
  const [
    totalUsers,
    totalProducts,
    activeOrders,
    revenueResult,
    totalReviews,
    approvedReviews,
    pendingReviews,
    totalPosts,
    publishedPosts,
    scheduledPosts,
    draftPosts,
  ] = await Promise.all([
    // Total users
    User.count(),
    
    // Total products
    Product.count(),
    
    // Active orders (pending, processing, shipped)
    Order.count({
      where: {
        order_status: {
          [Op.in]: ["pending", "processing", "shipped"],
        },
      },
    }),
    
    // Total revenue from delivered orders
    Order.findOne({
      where: { order_status: "delivered" },
      attributes: [[fn("COALESCE", fn("SUM", col("total_amount")), 0), "revenue"]],
      raw: true,
    }),

    // Total reviews
    ProductReview.count(),

    // Approved reviews
    ProductReview.count({
      where: { is_approved: true },
    }),

    // Pending reviews
    ProductReview.count({
      where: { is_approved: false },
    }),

    // Total posts
    Post.count(),

    // Truly published posts (published and date is now or past)
    Post.count({
      where: {
        post_status: "published",
        [Op.or]: [
          { post_publish_date: null },
          { post_publish_date: { [Op.lte]: new Date() } }
        ]
      },
    }),

    // Scheduled posts (published but date is in future)
    Post.count({
      where: {
        post_status: "published",
        post_publish_date: { [Op.gt]: new Date() }
      },
    }),

    // Draft posts
    Post.count({
      where: { post_status: "draft" },
    }),
  ]);

  return {
    totalUsers,
    totalProducts,
    activeOrders,
    totalRevenue: parseFloat(revenueResult?.revenue || 0),
    // Review stats
    totalReviews,
    approvedReviews,
    pendingReviews,
    // Post stats
    totalPosts,
    publishedPosts,
    scheduledPosts,
    draftPosts,
  };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getStats,
};
