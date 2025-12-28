/////////////////////////////////////
// ===== ADMIN USER ROUTES ======= //
/////////////////////////////////////

// Admin routes for user management operations

// ======= Module imports ======= //
const express = require("express");
const router = express.Router();

// ======= Controller imports ======= //
const {
  getUsers,
  getUser,
  patchUserStatus,
  patchUserRole,
  putUser,
} = require("../controllers/adminUserController");

// ======= Middleware imports ======= //
const { requireAdmin } = require("../middleware/adminMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

// ======= Validator imports ======= //
const {
  updateUserStatusSchema,
  updateUserRoleSchema,
  querySchema,
} = require("../validators/adminValidator");

///////////////////////////////////
// ===== ROUTE DEFINITIONS ===== //
///////////////////////////////////

// ===== GET /api/admin/users ===== //
// Get all users with pagination and filters
// Access: Admin only
router.get(
  "/admin/users",
  requireAdmin,
  validateRequest(querySchema, "query"),
  getUsers
);

// ===== GET /api/admin/users/:userId ===== //
// Get specific user details
// Access: Admin only
router.get("/admin/users/:userId", requireAdmin, getUser);

// ===== PUT /api/admin/users/:userId ===== //
// Update user profile information
// Access: Admin only
router.put("/admin/users/:userId", requireAdmin, putUser);

// ===== PATCH /api/admin/users/:userId/status ===== //
// Update user status (active, inactive, suspended)
// Access: Admin only
router.patch(
  "/admin/users/:userId/status",
  requireAdmin,
  validateRequest(updateUserStatusSchema, "body"),
  patchUserStatus
);

// ===== PATCH /api/admin/users/:userId/role ===== //
// Update user role (user, admin)
// Access: Admin only
router.patch(
  "/admin/users/:userId/role",
  requireAdmin,
  validateRequest(updateUserRoleSchema, "body"),
  patchUserRole
);

module.exports = router;
