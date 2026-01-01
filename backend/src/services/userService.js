///////////////////////////////////////////////////////////////////////
// ================ USER SERVICE (SEQUELIZE) ======================= //
///////////////////////////////////////////////////////////////////////

// This service handles user-related business logic using Sequelize ORM
// Provides CRUD operations for user management

// ======= Model Imports ======= //
const { User } = require("../models");

///////////////////////////////////////////////////////////////////////
// ================ SERVICE FUNCTIONS ============================== //
///////////////////////////////////////////////////////////////////////

// ===== Get User By Email ===== //
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { user_email: email },
      attributes: [
        "user_id",
        "user_firstname",
        "user_lastname",
        "user_email",
        "user_password",
        "user_nickname",
        "user_avatar",
        "user_address",
        "user_address_line_2",
        "user_city",
        "user_state",
        "user_zipcode",
        "user_role",
        "user_status",
      ],
    });
    return user ? user.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// ===== Get User By ID ===== //
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "user_id",
        "user_firstname",
        "user_lastname",
        "user_email",
        "user_password",
        "user_nickname",
        "user_avatar",
        "user_address",
        "user_address_line_2",
        "user_city",
        "user_state",
        "user_zipcode",
        "user_role",
        "user_status",
      ],
    });
    return user ? user.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// ===== Create User ===== //
const createUser = async (userData) => {
  try {
    console.log("createUser called with:", {
      ...userData,
      user_password: "[REDACTED]",
    });

    const user = await User.create({
      user_id: userData.user_id,
      user_firstname: userData.user_firstname,
      user_lastname: userData.user_lastname,
      user_email: userData.user_email,
      user_password: userData.user_password,
      user_nickname: userData.user_nickname,
      user_avatar: userData.user_avatar,
      user_address: userData.user_address,
      user_address_line_2: userData.user_address_line_2,
      user_city: userData.user_city,
      user_state: userData.user_state,
      user_zipcode: userData.user_zipcode,
      user_role: userData.user_role || "user",
    });

    console.log("User created successfully.");
    return user.get({ plain: true });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ===== Update User ===== //
const updateUser = async (userId, userData) => {
  try {
    // Accept both snake_case and camelCase field names
    const updateData = {
      user_firstname: userData.user_firstname ?? userData.firstName,
      user_lastname: userData.user_lastname ?? userData.lastName,
      user_email: userData.user_email ?? userData.email,
      user_nickname: userData.user_nickname ?? userData.nickname,
      user_avatar: userData.user_avatar ?? userData.avatar,
      user_address: userData.user_address ?? userData.address,
      user_address_line_2: userData.user_address_line_2 ?? userData.addressLine2,
      user_city: userData.user_city ?? userData.city,
      user_state: userData.user_state ?? userData.state,
      user_zipcode: userData.user_zipcode ?? userData.zipCode,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const [affectedRows] = await User.update(updateData, {
      where: { user_id: userId },
    });

    return { affectedRows };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ===== Update Password ===== //
const updatePassword = async (userId, hashedPassword) => {
  try {
    const [affectedRows] = await User.update(
      { user_password: hashedPassword },
      { where: { user_id: userId } }
    );

    if (affectedRows === 0) {
      throw new Error("User not found");
    }

    console.log("Password updated successfully for user:", userId);
    return { affectedRows };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// ===== Get All Users (Admin) ===== //
const getAllUsers = async (options = {}) => {
  try {
    const { page = 1, limit = 20, status, role, search } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.user_status = status;
    if (role) where.user_role = role;

    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { user_firstname: { [Op.like]: `%${search}%` } },
        { user_lastname: { [Op.like]: `%${search}%` } },
        { user_email: { [Op.like]: `%${search}%` } },
        { user_nickname: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["user_password"] },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      users: rows.map((u) => u.get({ plain: true })),
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// ===== Update User Role ===== //
const updateUserRole = async (userId, role) => {
  try {
    const [affectedRows] = await User.update(
      { user_role: role },
      { where: { user_id: userId } }
    );
    return { affectedRows };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// ===== Update User Status ===== //
const updateUserStatus = async (userId, status) => {
  try {
    const [affectedRows] = await User.update(
      { user_status: status },
      { where: { user_id: userId } }
    );
    return { affectedRows };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// ===== Delete User ===== //
const deleteUser = async (userId) => {
  try {
    const affectedRows = await User.destroy({
      where: { user_id: userId },
    });
    return { affectedRows };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////
// ================ LEGACY CALLBACK WRAPPERS ======================= //
///////////////////////////////////////////////////////////////////////
// These wrappers maintain backward compatibility with existing code
// that uses callback patterns

const userServiceLegacy = {
  getUserByEmail: (email, callback) => {
    getUserByEmail(email)
      .then((user) => callback(null, user))
      .catch((err) => callback(err, null));
  },

  getUserById: (userId, callback) => {
    getUserById(userId)
      .then((user) => callback(null, user))
      .catch((err) => callback(err, null));
  },

  createUser: (userData, callback) => {
    createUser(userData)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  updateUser: (userId, userData, callback) => {
    updateUser(userId, userData)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },

  updatePassword: (userId, hashedPassword, callback) => {
    updatePassword(userId, hashedPassword)
      .then((result) => callback(null, result))
      .catch((err) => callback(err, null));
  },
};

///////////////////////////////////////////////////////////////////////
// ================ EXPORTS ======================================== //
///////////////////////////////////////////////////////////////////////

module.exports = {
  // Async methods (recommended)
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  updatePassword,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,

  // Legacy callback wrappers (for backward compatibility)
  ...userServiceLegacy,
};
