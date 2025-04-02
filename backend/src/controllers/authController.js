// ======= Module imports ======= //
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');

// ======= BCRYPT CONFIGURATION ======= //
const saltRounds = 10;

// ======= DEFAULT AVATAR PATH ======= //
const defaultAvatarPath = '/uploads/avatars/pre-set/default.png';

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

// ======================== REGISTER USER ======================== //

const register = async (req, res) => {
  console.log("Register request received!");

  try {
    const { firstName, lastName, email, password, confirmPassword, nickname, avatar, address, city, zipCode } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    console.log("Password received:", password);
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    const userId = uuidv4(); // Generate a unique user ID using uuid

    const userData = { // User data object
      USER_ID: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      nickname,
      avatar: avatar || defaultAvatarPath,
      address,
      city,
      zipCode,
    };

    userModel.createUser(userData, (err, result) => { // Insert user into the database
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: err.message || 'Registration failed' });
      }

      console.log('User registered successfully');
      return res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    return handleServerError(res, error, 'Registration error');
  }
};

// ======================== UPLOAD AVATAR ======================== //

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

// ======================== LOGIN USER ========================= //

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    userModel.getUserByEmail(email, async (err, user) => {
      if (err) {
        return handleServerError(res, err, 'Login failed');
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

    // ======================== PASSWORD CHECK ========================= //  

      try {
        const passwordMatch = await bcrypt.compare(password, user.USER_PASSWORD);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userAvatar = user.USER_AVATAR || defaultAvatarPath;
        const userProfile = createUserProfile({ ...user, USER_AVATAR: userAvatar });

        console.log('Login successful. Sending user profile:', userProfile); // Log the user profile being sent
        
        return res.status(200).json({ message: 'Login successful', user: userProfile });

      } catch (compareError) {
        return handleServerError(res, compareError, 'Login failed (bcrypt error)');
      }
    });
  } catch (error) {
    return handleServerError(res, error, 'Login error');
  }
};

// ======================== GET PROFILE ========================= //

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    userModel.getUserById(userId, (err, user) => {
      if (err) {
        return handleServerError(res, err, 'Failed to get profile');
      }

      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(404).json({ message: 'Profile not found' });
      }

      const userProfile = createUserProfile(user);
      console.log('Profile retrieved successfully');
      return res.status(200).json({ message: 'Profile retrieved successfully', user: userProfile });
    });
  } catch (error) {
    return handleServerError(res, error, 'Get profile error');
  }
};

// ======================== UPDATE PROFILE ===================== //

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, email, nickname, avatar, address, city, zipCode } = req.body;

    // Update user data in the database
    userModel.updateUser(userId, { firstName, lastName, email, nickname, avatar, address, city, zipCode }, (err, result) => {
      if (err) {
        return handleServerError(res, err, 'Profile update failed');
      }

      console.log('Profile updated successfully');
      return res.status(200).json({ message: 'Profile updated successfully' });
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