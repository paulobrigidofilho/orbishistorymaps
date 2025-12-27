///////////////////////////////////
// ===== ADMIN MIDDLEWARE ======= //
///////////////////////////////////

// This middleware verifies that the user has admin privileges

///////////////////////////////////
// ===== HELPER FUNCTIONS ====== //
///////////////////////////////////

// ===== requireAdmin Function ===== //
// Ensures the user is logged in and has admin role

const requireAdmin = (req, res, next) => {
  // Check if user is logged in
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  // Check if user has admin role
  if (req.session.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin privileges required. Access denied.",
    });
  }

  // User is authenticated and is admin, proceed
  next();
};

// ===== optionalAdmin Function ===== //
// Checks if user is admin but doesn't block request

const optionalAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    req.isAdmin = true;
  } else {
    req.isAdmin = false;
  }
  next();
};

module.exports = {
  requireAdmin,
  optionalAdmin,
};
