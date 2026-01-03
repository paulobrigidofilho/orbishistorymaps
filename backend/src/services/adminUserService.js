///////////////////////////////////////////////////////////////////////
// ================ ADMIN USER SERVICE (SEQUELIZE) ================= //
///////////////////////////////////////////////////////////////////////

// This service manages admin operations for user management

// ======= Module Imports ======= //
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

// ======= Model Imports ======= //
const { User, CartItem } = require("../models");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== getAllUsers Function ===== //
// Retrieves paginated list of all users with optional filters

const getAllUsers = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    role = "all",
    status = "all",
    country = "all",
    sortBy = "user_id",
    sortOrder = "desc",
  } = filters;

  const offset = (page - 1) * limit;

  // Build WHERE clause
  const whereConditions = {};

  if (search) {
    whereConditions[Op.or] = [
      { user_email: { [Op.like]: `%${search}%` } },
      { user_firstname: { [Op.like]: `%${search}%` } },
      { user_lastname: { [Op.like]: `%${search}%` } },
      { user_nickname: { [Op.like]: `%${search}%` } },
    ];
  }

  if (role !== "all") {
    whereConditions.user_role = role;
  }

  if (status !== "all") {
    whereConditions.user_status = status;
  }

  if (country !== "all") {
    whereConditions.user_country = country;
  }

  // Validate and sanitize sort parameters
  const allowedSortFields = [
    "user_id",
    "user_email",
    "user_firstname",
    "user_lastname",
    "user_role",
    "user_status",
    "user_country",
    "created_at",
    "updated_at",
  ];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "user_id";
  const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

  console.log(`[adminUserService] Sorting by: ${validSortBy} ${validSortOrder}`);

  // Get total count
  const total = await User.count({ where: whereConditions });

  // Get paginated users
  const users = await User.findAll({
    where: whereConditions,
    order: [[validSortBy, validSortOrder]],
    limit: limit,
    offset: offset,
  });

  const userProfiles = users.map((user) => createUserProfile(user.toJSON()));

  return {
    users: userProfiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ===== getUserById Function ===== //
// Retrieves detailed user information by ID

const getUserById = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  const userProfile = createUserProfile(user.toJSON());
  return userProfile;
};

// ===== updateUserStatus Function ===== //
// Updates user account status (active, inactive, suspended)

const updateUserStatus = async (userId, status, adminId) => {
  // Prevent admin from modifying their own status
  if (userId === adminId) {
    throw new Error(ADMIN_ERRORS.CANNOT_MODIFY_OWN_STATUS);
  }

  const [updated] = await User.update(
    { user_status: status },
    { where: { user_id: userId } }
  );

  if (updated === 0) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  // Fetch updated user
  return getUserById(userId);
};

// ===== updateUserRole Function ===== //
// Updates user role (user, admin)

const updateUserRole = async (userId, role, adminId) => {
  // Prevent admin from modifying their own role
  if (userId === adminId) {
    throw new Error(ADMIN_ERRORS.CANNOT_MODIFY_OWN_ROLE);
  }

  const [updated] = await User.update(
    { user_role: role },
    { where: { user_id: userId } }
  );

  if (updated === 0) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  // Fetch updated user
  return getUserById(userId);
};

// ===== updateUser Function ===== //
// Updates user profile information (supports partial updates)
// Automatically hashes password if provided

const updateUser = async (userId, updates, adminId) => {
  // Build dynamic update object
  const allowedFields = [
    "user_firstname",
    "user_lastname",
    "user_nickname",
    "user_avatar",
    "user_address",
    "user_address_line_2",
    "user_city",
    "user_state",
    "user_zipcode",
    "user_country",
    "user_password",
  ];

  const updateData = {};

  // Map frontend field names to database column names
  const fieldMapping = {
    firstName: "user_firstname",
    lastName: "user_lastname",
    nickname: "user_nickname",
    avatar: "user_avatar",
    address: "user_address",
    addressLine2: "user_address_line_2",
    city: "user_city",
    state: "user_state",
    zipCode: "user_zipcode",
    country: "user_country",
    password: "user_password",
  };

  for (const [key, value] of Object.entries(updates)) {
    const fieldName = fieldMapping[key];

    if (fieldName && allowedFields.includes(fieldName)) {
      // Hash password if it's being updated
      if (fieldName === "user_password") {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        updateData[fieldName] = await bcrypt.hash(value, saltRounds);
      } else {
        updateData[fieldName] = value;
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error(ADMIN_ERRORS.USER_UPDATE_FAILED);
  }

  const [updated] = await User.update(updateData, {
    where: { user_id: userId },
  });

  if (updated === 0) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  // Fetch updated user
  return getUserById(userId);
};

// ===== deleteUserById Function ===== //
// Deletes a user account and all associated data
// Admin accounts cannot be deleted

const deleteUserById = async (userId, adminId) => {
  // Prevent deleting own account
  if (userId === adminId) {
    throw new Error(ADMIN_ERRORS.CANNOT_DELETE_SELF);
  }

  // First, check if user exists and is not an admin
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  // Prevent deletion of admin accounts
  if (user.user_role === "admin") {
    throw new Error(ADMIN_ERRORS.CANNOT_DELETE_ADMIN);
  }

  // Delete user avatar file if exists
  if (user.user_avatar && !user.user_avatar.startsWith("http")) {
    const avatarPath = path.join(__dirname, "../../", user.user_avatar);
    if (fs.existsSync(avatarPath)) {
      try {
        fs.unlinkSync(avatarPath);
        console.log(`Deleted avatar file: ${avatarPath}`);
      } catch (fileErr) {
        console.error(`Failed to delete avatar file: ${fileErr.message}`);
      }
    }
  }

  // Delete user's cart items
  await CartItem.destroy({ where: { user_id: userId } });

  // Note: Order history is preserved for records
  console.log(`Note: Order history for user ${userId} is preserved`);

  // Finally, delete the user
  const deleted = await User.destroy({ where: { user_id: userId } });

  if (deleted === 0) {
    throw new Error(ADMIN_ERRORS.USER_NOT_FOUND);
  }

  return {
    userId: userId,
    deleted: true,
  };
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUser,
  deleteUserById,
};
