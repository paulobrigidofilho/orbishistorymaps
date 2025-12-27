// ======= Module imports ======= //
const db = require("../config/config").db;

///////////////////////////////////////////////////////////////////////
// ==================== PASSWORD RESET MODEL ======================= //
///////////////////////////////////////////////////////////////////////

const passwordResetModel = {
  ///////////////////////////////////////////////////////////////////////
  // ===================== CREATE RESET TOKEN ======================== //
  ///////////////////////////////////////////////////////////////////////

  createResetToken: (tokenData, callback) => {
    const query = `
      INSERT INTO password_resets (user_id, reset_token, expires_at)
      VALUES (?, ?, ?)`;

    db.query(
      query,
      [tokenData.userId, tokenData.token, tokenData.expiresAt],
      (err, result) => {
        if (err) {
          console.error("Database INSERT error:", err);
          return callback(err, null);
        }
        console.log("Reset token created successfully");
        return callback(null, result);
      }
    );
  },

  ///////////////////////////////////////////////////////////////////////
  // ===================== FIND VALID TOKEN ========================== //
  ///////////////////////////////////////////////////////////////////////

  findValidToken: (hashedToken, callback) => {
    const query = `
      SELECT reset_id, user_id, reset_token, expires_at, used_at
      FROM password_resets
      WHERE reset_token = ?
        AND expires_at > NOW()
        AND used_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1`;

    db.query(query, [hashedToken], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return callback(err, null);
      }

      return callback(null, results[0] || null);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ===================== INVALIDATE TOKEN ========================== //
  ///////////////////////////////////////////////////////////////////////

  invalidateToken: (resetId, callback) => {
    const query = `
      UPDATE password_resets
      SET used_at = NOW()
      WHERE reset_id = ?`;

    db.query(query, [resetId], (err, result) => {
      if (err) {
        console.error("Database UPDATE error:", err);
        return callback(err, null);
      }
      console.log("Reset token invalidated successfully");
      return callback(null, result);
    });
  },

  ///////////////////////////////////////////////////////////////////////
  // ================ DELETE EXPIRED TOKENS ========================== //
  ///////////////////////////////////////////////////////////////////////

  deleteExpiredTokens: (callback) => {
    const query = `
      DELETE FROM password_resets
      WHERE expires_at < NOW()
        OR used_at IS NOT NULL`;

    db.query(query, (err, result) => {
      if (err) {
        console.error("Database DELETE error:", err);
        return callback(err, null);
      }
      console.log(`Deleted ${result.affectedRows} expired/used tokens`);
      return callback(null, result);
    });
  }
};

// ======= Add updatePassword to userModel ======= //
// This method should be added to the existing userModel.js file
// but we'll export it here for reference

module.exports = passwordResetModel;
