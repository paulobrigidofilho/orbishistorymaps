// ======= Module imports ======= //
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer"); // Import multer directly
const path = require("path");

//////////////////////////////////////////
// ======= MULTER CONFIGURATION ======= //
//////////////////////////////////////////

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/avatars")); // Set the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Generate a unique filename
  },
});

// Set up multer with the storage configuration and file filter

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Define allowed file types
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, .png and .gif files are allowed!"));
    }
  },
});

// ======= BCRYPT CONFIGURATION ======= //

const saltRounds = 10;

///////////////////////////////////////////////////////////////////////
// ========================= HELPER FUNCTIONS ====================== //
///////////////////////////////////////////////////////////////////////

// Centralized error handling function
const handleServerError = (res, error, message) => {
  console.error(message + ":", error);
  return res.status(500).json({ message: error.message || message });
};

// Function to create a user profile object (removes duplication)
const createUserProfile = (user) => ({
  USER_ID: user.USER_ID,
  USER_FIRSTNAME: user.USER_FIRSTNAME || "",
  USER_LASTNAME: user.USER_LASTNAME || "",
  USER_EMAIL: user.USER_EMAIL || "",
  USER_NICKNAME: user.USER_NICKNAME || "",
  USER_AVATAR: user.USER_AVATAR || "",
  USER_ADDRESS: user.USER_ADDRESS || "",
  USER_CITY: user.USER_CITY || "",
  USER_ZIPCODE: user.USER_ZIPCODE || "",
});

/////////////////////////////////////////////////////////////////////
// ======================= CONTROLLER FUNCTIONS ================== //
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// ========================= REGISTER USER ======================= //
/////////////////////////////////////////////////////////////////////

const register = async (req, res) => {
  console.log("Register request received!");

  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      return handleServerError(res, err, "File upload failed");
    }

    console.log("Req.file:", req.file);

    try {
      console.log("Request body:", req.body);

      // Check if the request body contains the required fields

      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        nickname,
        address,
        city,
        zipCode,
      } = req.body;

      // ================ Required Fields Validation ================ //
      // Validate required fields

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !nickname
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // ===================== Name Validation ===================== //
      // Check if firstName and lastName contain only valid characters (letters and spaces)

      const nameRegex = /^[a-zA-Z\u00C0-\u017F\s-]*$/; // Allow letters (including accented characters), spaces, and hyphens
      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res
          .status(400)
          .json({
            message:
              "Please use only letters, spaces, and hyphens in your first and last name.",
          });
      }

      // ===================== Password Validation ===================== //
      // Check if password and confirmPassword match

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // ==================== Email Validation ===================== //
      // Check if email already exists

      userModel.getUserByEmail(email, (err, existingUser) => {
        if (err) {
          return handleServerError(
            res,
            err,
            "Database error during email check"
          );
        }

        console.log("User fetched by email:", existingUser); // Debugging log

        if (existingUser) {
          return res
            .status(400)
            .json({ message: "This email is already in use." });
        }

        //////////////////////////////////////////////////////////////////////////////////
        // ======================== PASSWORD AND UUID HASHING ========================= //
        // ========== userData is the object that will be inserted into the DB ======== //
        //////////////////////////////////////////////////////////////////////////////////

        try {
          
          // ========================= Password Hashing ========================= //
          // Hash the password using bcrypt

          bcrypt.hash(password, saltRounds, (hashError, hashedPassword) => {
            if (hashError) {
              return handleServerError(
                res,
                hashError,
                "Password hashing error"
              );
            }

          // ========================= UUID Generation ========================= //

            const userId = uuidv4();

          // ========================= Avatar URL ========================= //
          // Set the avatar URL based on whether a file was uploaded or not

            const avatarUrl = req.file
              ? `/uploads/avatars/${req.file.filename}`
              : "/uploads/avatars/pre-set/default.png";
            console.log("Avatar URL being saved:", avatarUrl);

          // ========================= User Data Object ========================= //

            const userData = {
              USER_ID: userId, // Use the generated UUID
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hashedPassword, // Use the hashed password
              nickname: nickname,
              address: address,
              city: city,
              zipCode: zipCode,
              avatar: avatarUrl, // Use the avatar URL generated above
            };

            console.log("UserData before createUser:", userData);

             /////////////////////////////////////////////////////////////////////////////////
            // ======================== CREATE USER IN DATABASE =========================== //
            // == userModel.createUser is the function that inserts the user into the DB == //
            //////////////////////////////////////////////////////////////////////////////////

            userModel.createUser(
              userData,
              (createUserErr, createUserResult) => {
                if (createUserErr) {
                  console.error("Database error:", createUserErr);
                  return res
                    .status(500)
                    .json({
                      message: createUserErr.message || "Registration failed",
                    });
                }

                // ======================== USER PROFILE CREATION ========================= //

                const userProfile = createUserProfile(userData);
                return res.status(201).json({
                  message: "User registered successfully",
                  user: userProfile,
                });
              }
            );
          });
        } catch (error) { // Handle any unexpected errors 
            
            return handleServerError(
            res,
            error,
            `An unexpected error occurred during the registration process: ${error.message}`
            );
        }
      });
    } catch (error) { // Handle any unexpected errors
      
      return handleServerError(res, error, `An unexpected error occurred during the registration process: ${error.message}`);
    }
  });
};

/////////////////////////////////////////////////////////////////////
// ======================== UPLOAD AVATAR ======================== //
/////////////////////////////////////////////////////////////////////

const uploadAvatar = async (req, res) => {
  try {
    let avatarUrl;

    if (!req.file) {
      // Use the default avatar URL from the database
      avatarUrl = "/uploads/avatars/default-avatar.png"; // Replace with your actual default value
      console.log("No avatar file provided. Using default avatar.");
    } else {
      // Use the uploaded file's URL
      avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log("Avatar uploaded successfully");
    }

    return res
      .status(200)
      .json({ message: "Avatar processed successfully", avatarUrl });
  } catch (error) {
    return handleServerError(res, error, `Avatar upload error: ${error.message}`);
  }
};

// ////////////////////////////////////////////////////////////////
// ======================== LOGIN USER ========================= //
///////////////////////////////////////////////////////////////////

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    userModel.getUserByEmail(email, async (err, user) => {
      if (err) {
        // Handle database error
        return handleServerError(res, err, `Login failed: ${err.message}`);
      }

      if (!user) {
        // Handle user not found
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // ======================== PASSWORD CHECK ========================= //

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          user.USER_PASSWORD
        );

        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // ======================== USER PROFILE CREATION ========================= //

        const userProfile = createUserProfile(user);

        return res.status(200).json({ user: userProfile });
      } catch (compareError) {
        return handleServerError(
          res,
          compareError,
          "Error occurred while comparing passwords"
        );
      }
    });
  } catch (error) {
    return handleServerError(res, error, `Login error: ${error.message}`);
  }
};

////////////////////////////////////////////////////////////////////
// ======================== GET PROFILE ========================= //
////////////////////////////////////////////////////////////////////

const getProfile = async (req, res) => {
  try {
    // Check if userId is provided in the request parameters
    const userId = req.params.userId;

    userModel.getUserById(userId, (err, user) => {
      if (err) {
        return handleServerError(res, err, "Failed to get profile"); // Handle database error
      }

      if (!user) {
        return res.status(404).json({ message: "Profile not found" }); // Handle user not found
      }

      const userProfile = createUserProfile(user); // Create user profile object
      return res
        .status(200)
        .json({ message: "Profile retrieved successfully", user: userProfile });
    });
  } catch (error) {
    return handleServerError(res, error, `Get profile error: ${error.message}`);
  }
};

///////////////////////////////////////////////////////////////////
// ======================== UPDATE PROFILE ===================== //
///////////////////////////////////////////////////////////////////

const updateProfile = async (req, res) => {
  // Use multer middleware for file uploads
  upload.single("avatar")(req, res, async (err) => {
    if (err) {
      return handleServerError(res, err, "File upload failed");
    }
    
    try {
      // Get userId from params
      const userId = req.params.userId;
      
      // Get form data
      const {
        firstName,
        lastName,
        email,
        nickname,
        avatarUrl, // This will be sent if using existing avatar
        address,
        city,
        zipCode,
      } = req.body;
      
      // Determine avatar path - use uploaded file, existing path, or default
      let avatarPath;
      if (req.file) {
        // New file was uploaded
        avatarPath = `/uploads/avatars/${req.file.filename}`;
      } else if (avatarUrl) {
        // Use existing avatar URL
        avatarPath = avatarUrl;
      } else {
        // Use default avatar
        avatarPath = "/uploads/avatars/pre-set/default.png";
      }
      
      // Update user in database
      userModel.updateUser(
        userId,
        {
          firstName,
          lastName,
          email,
          nickname,
          avatar: avatarPath,
          address,
          city,
          zipCode,
        },
        (err, result) => {
          if (err) {
            return handleServerError(res, err, "Profile update failed");
          }
          
          // Get updated user
          userModel.getUserById(userId, (getUserErr, updatedUser) => {
            if (getUserErr) {
              return handleServerError(res, getUserErr, "Failed to get updated profile");
            }
            
            const userProfile = createUserProfile(updatedUser);
            return res.status(200).json({
              message: "Profile updated successfully",
              user: userProfile,
            });
          });
        }
      );
    } catch (error) {
      return handleServerError(res, error, `Profile update error: ${error.message}`);
    }
  });
};

///////////////////////////////////////////////////////////////////////
// ========================= EXPORT CONTROLLER ===================== //
///////////////////////////////////////////////////////////////////////

const authController = {
  register,
  uploadAvatar,
  login,
  getProfile,
  updateProfile,
};

module.exports = authController;
