///////////////////////////////////////
// ======= LOGIN CONTROLLER ======== //
///////////////////////////////////////

// This controller handles user login, logout, and session restoration

// ======= Module imports ======= //

const config = require("../config/config");
const { handleServerError } = require("../helpers/handleServerError");
const { AUTH_ERRORS } = require("../constants/errorMessages");
const { AUTH_SUCCESS } = require("../constants/successMessages");
const { loginUser } = require("../services/loginUserService");

// ====== Login Function ====== //

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const userProfile = await loginUser({ email, password });

    if (req.session) {
      req.session.user = userProfile;
    }

    console.log("Login successful. Sending user profile:", userProfile);
    return res
      .status(200)
      .json({ message: AUTH_SUCCESS.LOGIN_SUCCESS, user: userProfile });
  } catch (error) {
    if (error.message === AUTH_ERRORS.INVALID_CREDENTIALS) {
      return res.status(401).json({ message: AUTH_ERRORS.INVALID_CREDENTIALS });
    }
    return handleServerError(res, error, "Login error");
  }
};

// ====== Logout Function ====== //

const logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: AUTH_ERRORS.NO_ACTIVE_SESSION });
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: AUTH_ERRORS.LOGOUT_FAILED });
    }
    const cookieName = config.authConfig.session.cookieName;
    res.clearCookie(cookieName);
    return res.status(200).json({ message: AUTH_SUCCESS.LOGOUT_SUCCESS });
  });
};

// ====== Get Session Function ====== //

const getSession = (req, res) => {
  try {
    console.log("GET /api/session called. Session exists:", !!req.session);
    console.log("Session user:", req.session?.user?.id || "No user in session");

    if (!req.session) {
      console.error("Session object is undefined!");
      return res.status(500).json({ message: AUTH_ERRORS.SESSION_INIT_ERROR });
    }

    if (req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(200).json({ user: null });
  } catch (err) {
    console.error("Session error:", err);
    return handleServerError(res, err, "Get session error");
  }
};

module.exports = { login, logout, getSession };
