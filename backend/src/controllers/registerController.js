//////////////////////////////////////////
// ======= REGISTER CONTROLLER ======== //
//////////////////////////////////////////

// This controller handles user registration with optional avatar upload

// ======= Module imports ======= //

const { handleServerError } = require("../helpers/handleServerError");
const { registerUser } = require("../services/registerUserService");
const { saveAvatarUrl } = require("../services/avatarService");

// ====== Register User Function ====== //

const register = async (req, res) => {
  console.log("Register request received!");
  if (req.body && req.body.email) {
    console.log("Incoming registration for email:", req.body.email);
  }

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      nickname,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    } = req.body;

    const avatarPath = req.file
      ? await saveAvatarUrl(req.file.filename)
      : null;

    const userProfile = await registerUser({
      firstName,
      lastName,
      email,
      password,
      nickname,
      avatar: avatarPath,
      address,
      addressLine2,
      city,
      state,
      zipCode,
    });

    if (req.session) {
      req.session.user = userProfile;
    }

    console.log("User profile after registration:", userProfile);
    return res
      .status(201)
      .json({ message: "User registered successfully", user: userProfile });
  } catch (error) {
    if (
      error.message === "This email is already in use." ||
      error.message === "Missing required fields"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return handleServerError(res, error, "Registration error");
  }
};

module.exports = { register };
