// ======= Module imports ======= //
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');

// ======= BCRYPT CONFIGURATION ======= //
const saltRounds = 10;

///////////////////////////////////////////////////////////////////////
// ========================= HELPER FUNCTIONS ====================== //
///////////////////////////////////////////////////////////////////////

// Centralized error handling function
const handleServerError = (res, error, message) => {
    console.error(message + ':', error);
    return res.status(500).json({ message: error.message || message });
};

// Function to create a user profile object (removes duplication)
const createUserProfile = (user) => ({
    USER_ID: user.USER_ID,
    USER_FIRSTNAME: user.USER_FIRSTNAME || '',
    USER_LASTNAME: user.USER_LASTNAME || '',
    USER_EMAIL: user.USER_EMAIL || '',
    USER_NICKNAME: user.USER_NICKNAME || '',
    USER_AVATAR: user.USER_AVATAR || '',
    USER_ADDRESS: user.USER_ADDRESS || '',
    USER_CITY: user.USER_CITY || '',
    USER_ZIPCODE: user.USER_ZIPCODE || '',
});

/////////////////////////////////////////////////////////////////////
// ======================= CONTROLLER FUNCTIONS ================== //
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// ========================= REGISTER USER ======================= //
/////////////////////////////////////////////////////////////////////

const register = async (req, res) => {
    console.log("Register request received!");
    console.log("Request body:", req.body); // Debugging log to inspect incoming data

    try {
        const { firstName, lastName, email, password, confirmPassword, nickname, avatar, address, city, zipCode } = req.body;

        // Validate required fields
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if email already exists
        userModel.getUserByEmail(email, (err, existingUser) => {
            if (err) {
                return handleServerError(res, err, 'Database error during email check');
            }

            console.log("User fetched by email:", existingUser); // Debugging log

            if (existingUser) {
                return res.status(400).json({ message: 'This email is already in use.' });
            }

            //////////////////////////////////////////////////////////////////////////////////
            // ======================== PASSWORD AND UUID HASHING ========================= //
            // ================= userData is the object that will be inserted into the DB = //
            //////////////////////////////////////////////////////////////////////////////////
           
            bcrypt.hash(password, saltRounds).then((hashedPassword) => {
                
            const userId = uuidv4();

            // Create user data object
            const userData = {
              USER_ID: userId,
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hashedPassword,
              nickname: nickname,
              address: address,
              city: city,
              zipCode: zipCode,
              avatar: avatar || '/uploads/avatars/pre-set/default.png' 
            };

                /////////////////////////////////////////////////////////////////////
                // ========================= CREATE USER ========================= //
                /////////////////////////////////////////////////////////////////////

                // Create user in the database
                userModel.createUser(userData, (err, result) => { 
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ message: err.message || 'Registration failed' });
                    }
                    console.log('User registered successfully');

                    // Fetch the complete user profile from the database using the email
                    userModel.getUserByEmail(userData.email, (err, user) => {
                        if (err) {
                            return handleServerError(res, err, 'Failed to get newly created profile');
                        }

                        if (!user) {
                            return res.status(500).json({ message: 'User registered but not found' });
                        }

                        // Ensure the avatar URL is correctly included
                        const userProfile = createUserProfile(user); // Create user profile object
                        return res.status(201).json({
                            message: 'User registered successfully',
                            user: userProfile
                        });
                    });
                });
            });
        });
    } catch (error) {
        return handleServerError(res, error, 'Registration error');
    }
};

/// /////////////////////////////////////////////////////////////////
// ======================== UPLOAD AVATAR ======================== //
/////////////////////////////////////////////////////////////////////

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No avatar file provided' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    console.log('Avatar uploaded successfully');
    return res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
  } catch (error) {
    return handleServerError(res, error, 'Avatar upload error');
  }
};

// ////////////////////////////////////////////////////////////////
// ======================== LOGIN USER ========================= //
///////////////////////////////////////////////////////////////////

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    userModel.getUserByEmail(email, async (err, user) => {
      if (err) { // Handle database error
        return handleServerError(res, err, 'Login failed');
      }

      if (!user) { // Handle user not found
        return res.status(401).json({ message: 'Invalid credentials' });
      }

    // ======================== PASSWORD CHECK ========================= //  

      try {
        const passwordMatch = await bcrypt.compare(password, user.USER_PASSWORD);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

    // ======================== USER PROFILE CREATION ========================= //

        const userProfile = createUserProfile(user);
        
        return res.status(200).json({ user: userProfile });

      } catch (compareError) {
        return handleServerError(res, compareError, 'Login failed (bcrypt error)'); // Handle bcrypt error
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Login error');
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
        return handleServerError(res, err, 'Failed to get profile'); // Handle database error
      }

      if (!user) {
        return res.status(404).json({ message: 'Profile not found' }); // Handle user not found
      }

      const userProfile = createUserProfile(user); // Create user profile object
      return res.status(200).json({ message: 'Profile retrieved successfully', user: userProfile });
    });
  } catch (error) {
    return handleServerError(res, error, 'Get profile error');
  }
};

///////////////////////////////////////////////////////////////////
// ======================== UPDATE PROFILE ===================== //
///////////////////////////////////////////////////////////////////

const updateProfile = async (req, res) => {
  try {
    // Check if userId is provided in the request parameters
    const userId = req.params.userId;
    const { firstName, lastName, email, nickname, avatar, address, city, zipCode } = req.body;

    // Update user data in the database
    userModel.updateUser(userId, { firstName, lastName, email, nickname, avatar, address, city, zipCode }, (err, result) => {
      if (err) {
        return handleServerError(res, err, 'Profile update failed');
      }

      return res.status(200).json({ 
        message: 'Profile updated successfully', 
        result 
      });
    });
  } catch (error) {
    return handleServerError(res, error, 'Profile update error');
  }
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