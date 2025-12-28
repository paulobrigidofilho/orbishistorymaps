////////////////////////////////////////////////
// ======== ADMIN STATS SERVICE ============== //
////////////////////////////////////////////////

// This service provides statistics for the admin dashboard

// ======= Module Imports ======= //
const db = require("../config/config").db;

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== getStats Function ===== //
// Retrieves dashboard statistics

const getStats = async () => {
  return new Promise((resolve, reject) => {
    // Run multiple queries in parallel using Promise.all
    const queries = {
      totalUsers: new Promise((res, rej) => {
        db.query("SELECT COUNT(*) as count FROM users", (err, result) => {
          if (err) return rej(err);
          res(result[0].count);
        });
      }),
      totalProducts: new Promise((res, rej) => {
        db.query("SELECT COUNT(*) as count FROM products", (err, result) => {
          if (err) return rej(err);
          res(result[0].count);
        });
      }),
      activeOrders: new Promise((res, rej) => {
        db.query(
          "SELECT COUNT(*) as count FROM orders WHERE order_status IN ('pending', 'processing', 'shipped')",
          (err, result) => {
            if (err) return rej(err);
            res(result[0].count);
          }
        );
      }),
      totalRevenue: new Promise((res, rej) => {
        db.query(
          "SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE order_status = 'delivered'",
          (err, result) => {
            if (err) return rej(err);
            res(parseFloat(result[0].revenue));
          }
        );
      }),
    };

    Promise.all([
      queries.totalUsers,
      queries.totalProducts,
      queries.activeOrders,
      queries.totalRevenue,
    ])
      .then(([totalUsers, totalProducts, activeOrders, totalRevenue]) => {
        resolve({
          totalUsers,
          totalProducts,
          activeOrders,
          totalRevenue,
        });
      })
      .catch((err) => {
        console.error("Error fetching admin stats:", err);
        reject(err);
      });
  });
};

///////////////////////////////////
// ===== MODULE EXPORTS ======== //
///////////////////////////////////

module.exports = {
  getStats,
};
