////////////////////////////////////////////////
// ======== ADMIN USER SERVICE =============== //
////////////////////////////////////////////////

// This service manages admin operations for user management

// ======= Module Imports ======= //
const db = require("../config/config").db;

// ======= Model Imports ======= //
const userModel = require("../model/userModel");

// ======= Helper Imports ======= //
const { createUserProfile } = require("../helpers/createUserProfile");

// ======= Constants Imports ======= //
const { ADMIN_ERRORS } = require("../constants/adminMessages");

///////////////////////////////////
// ===== SERVICE FUNCTIONS ===== //
///////////////////////////////////

// ===== getAllUsers Function ===== //
// Retrieves paginated list of all users with optional filters

const getAllUsers = async (filters = {}) => {
  return new Promise((resolve, reject) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "all",
      status = "all",
      sortBy = "user_id",
      sortOrder = "desc",
    } = filters;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push(
        "(user_email LIKE ? OR user_firstname LIKE ? OR user_lastname LIKE ? OR user_nickname LIKE ?)"
      );
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (role !== "all") {
      whereConditions.push("user_role = ?");
      queryParams.push(role);
    }

    if (status !== "all") {
      whereConditions.push("user_status = ?");
      queryParams.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Validate and sanitize sort parameters
    const allowedSortFields = [
      "user_id",
      "user_email",
      "user_firstname",
      "user_lastname",
      "user_role",
      "user_status",
      "user_created_at",
      "user_updated_at",
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "user_id";
    const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    console.log(`[adminUserService] Sorting by: ${validSortBy} ${validSortOrder} (received: ${sortBy} ${sortOrder})`);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;

    db.query(countQuery, queryParams, (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;

      // Get paginated users
      const usersQuery = `
        SELECT 
          user_id,
          user_email,
          user_firstname,
          user_lastname,
          user_nickname,
          user_avatar,
          user_address,
          user_address_line_2,
          user_city,
          user_state,
          user_zipcode,
          user_role,
          user_status,
          user_password,
          user_created_at,
          user_updated_at
        FROM users
        ${whereClause}
        ORDER BY ${validSortBy} ${validSortOrder}
        LIMIT ? OFFSET ?
      `;

      console.log(`[adminUserService] SQL Query ORDER BY: ${validSortBy} ${validSortOrder}`);

      const usersParams = [...queryParams, limit, offset];

      db.query(usersQuery, usersParams, (err, users) => {
        if (err) return reject(err);

        const userProfiles = users.map((user) => createUserProfile(user));

        resolve({
          users: userProfiles,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    });
  });
};

// ===== getUserById Function ===== //
// Retrieves detailed user information by ID

const getUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    userModel.getUserById(userId, (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error(ADMIN_ERRORS.USER_NOT_FOUND));

      const userProfile = createUserProfile(user);
      resolve(userProfile);
    });
  });
};

// ===== updateUserStatus Function ===== //
// Updates user account status (active, inactive, suspended)

const updateUserStatus = async (userId, status, adminId) => {
  return new Promise((resolve, reject) => {
    // Prevent admin from modifying their own status
    if (userId === adminId) {
      return reject(new Error(ADMIN_ERRORS.CANNOT_MODIFY_OWN_STATUS));
    }

    const query = `
      UPDATE users 
      SET user_status = ?, user_updated_at = NOW() 
      WHERE user_id = ?
    `;

    db.query(query, [status, userId], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error(ADMIN_ERRORS.USER_NOT_FOUND));
      }

      // Fetch updated user
      getUserById(userId)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  });
};

// ===== updateUserRole Function ===== //
// Updates user role (user, admin)

const updateUserRole = async (userId, role, adminId) => {
  return new Promise((resolve, reject) => {
    // Prevent admin from modifying their own role
    if (userId === adminId) {
      return reject(new Error(ADMIN_ERRORS.CANNOT_MODIFY_OWN_ROLE));
    }

    const query = `
      UPDATE users 
      SET user_role = ?, user_updated_at = NOW() 
      WHERE user_id = ?
    `;

    db.query(query, [role, userId], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error(ADMIN_ERRORS.USER_NOT_FOUND));
      }

      // Fetch updated user
      getUserById(userId)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  });
};

// ===== updateUser Function ===== //
// Updates user profile information (supports partial updates)
// Automatically hashes password if provided

const updateUser = async (userId, updates, adminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Build dynamic update query
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
        "user_password",
      ];

      const updateFields = [];
      const values = [];

      // Only update fields that are provided
      for (const [key, value] of Object.entries(updates)) {
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
          password: "user_password",
        };

        const fieldName = fieldMapping[key];

        if (fieldName && allowedFields.includes(fieldName)) {
          // Hash password if it's being updated
          if (fieldName === "user_password") {
            const bcrypt = require("bcrypt");
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
            const hashedPassword = await bcrypt.hash(value, saltRounds);
            updateFields.push(`${fieldName} = ?`);
            values.push(hashedPassword);
          } else {
            updateFields.push(`${fieldName} = ?`);
            values.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        return reject(new Error(ADMIN_ERRORS.USER_UPDATE_FAILED));
      }

      // Always update the user_updated_at timestamp
      updateFields.push("user_updated_at = NOW()");
      values.push(userId);

      const query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;

      db.query(query, values, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) {
          return reject(new Error(ADMIN_ERRORS.USER_NOT_FOUND));
        }

        // Fetch updated user
        getUserById(userId)
          .then((user) => resolve(user))
          .catch((err) => reject(err));
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  updateUser,
};
