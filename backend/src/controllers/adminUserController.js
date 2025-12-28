///////////////////////////////////////
// ===== ADMIN USER CONTROLLER ====== //
///////////////////////////////////////

// This controller handles admin operations for user management

// ======= Module imports ======= //
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUser,
} = require("../services/adminUserService");
const { handleServerError } = require("../helpers/handleServerError");
const { ADMIN_ERRORS, ADMIN_SUCCESS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== CONTROLLER FUNCTIONS ==== //
///////////////////////////////////

// ====== Get All Users Function ====== //
// Retrieves paginated list of users with optional filters

const getUsers = async (req, res) => {
  console.log("==================== NEW REQUEST ====================");
  console.log("[adminUserController] req.url:", req.url);
  console.log("[adminUserController] req.originalUrl:", req.originalUrl);
  console.log("[adminUserController] Full req.query:", JSON.stringify(req.query, null, 2));
  
  try {
    console.log("[adminUserController] sortBy from query:", req.query.sortBy);
    console.log("[adminUserController] sortOrder from query:", req.query.sortOrder);
    
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || "",
      role: req.query.role || "all",
      status: req.query.status || "all",
      sortBy: req.query.sortBy || "user_id",
      sortOrder: req.query.sortOrder || "desc",
    };

    console.log("GET /api/admin/users requested with filters:", filters);

    const result = await getAllUsers(filters);

    console.log(
      `Retrieved ${result.users.length} users (page ${result.pagination.page}/${result.pagination.totalPages})`
    );

    return res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.USERS_RETRIEVED,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return handleServerError(res, error, "Get users error");
  }
};

// ====== Get User By ID Function ====== //
// Retrieves detailed user information

const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log(`GET /api/admin/users/${userId} requested`);

    const user = await getUserById(userId);

    console.log("User retrieved successfully:", user.email);

    return res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.USER_RETRIEVED,
      data: user,
    });
  } catch (error) {
    console.error("Error in getUser:", error);

    if (error.message === ADMIN_ERRORS.USER_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: ADMIN_ERRORS.USER_NOT_FOUND,
      });
    }

    return handleServerError(res, error, "Get user error");
  }
};

// ====== Update User Status Function ====== //
// Updates user account status (active, inactive, suspended)

const patchUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;
    const adminId = req.session.user.id;

    console.log(
      `PATCH /api/admin/users/${userId}/status requested by admin ${adminId}`
    );
    console.log("New status:", status);

    const updatedUser = await updateUserStatus(userId, status, adminId);

    console.log("User status updated successfully:", updatedUser.email);

    return res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.USER_STATUS_UPDATED,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in patchUserStatus:", error);

    if (
      error.message === ADMIN_ERRORS.USER_NOT_FOUND ||
      error.message === ADMIN_ERRORS.CANNOT_MODIFY_OWN_STATUS
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "Update user status error");
  }
};

// ====== Update User Role Function ====== //
// Updates user role (user, admin)

const patchUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { role } = req.body;
    const adminId = req.session.user.id;

    console.log(
      `PATCH /api/admin/users/${userId}/role requested by admin ${adminId}`
    );
    console.log("New role:", role);

    const updatedUser = await updateUserRole(userId, role, adminId);

    console.log("User role updated successfully:", updatedUser.email);

    return res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.USER_ROLE_UPDATED,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in patchUserRole:", error);

    if (
      error.message === ADMIN_ERRORS.USER_NOT_FOUND ||
      error.message === ADMIN_ERRORS.CANNOT_MODIFY_OWN_ROLE
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "Update user role error");
  }
};

// ====== Update User Profile Function ====== //
// Updates user profile information (supports partial updates)

const putUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;
    const adminId = req.session.user.id;

    console.log(
      `PUT /api/admin/users/${userId} requested by admin ${adminId}`
    );
    console.log("Updates:", updates);

    const updatedUser = await updateUser(userId, updates, adminId);

    console.log("User profile updated successfully:", updatedUser.email);

    return res.status(200).json({
      success: true,
      message: ADMIN_SUCCESS.USER_UPDATED,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in putUser:", error);

    if (error.message === ADMIN_ERRORS.USER_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return handleServerError(res, error, "Update user error");
  }
};

module.exports = {
  getUsers,
  getUser,
  patchUserStatus,
  patchUserRole,
  putUser,
};
