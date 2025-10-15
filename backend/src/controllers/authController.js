// ======= Module imports ======= //
const authService = require('../services/authService');

///////////////////////////////////////////////////////////////////////
// ======================= CONTROLLER FUNCTIONS ================== //
///////////////////////////////////////////////////////////////////////

// Centralized error handling function
const handleServerError = (res, error, message) => {
    console.error(message + ':', error);
    return res.status(500).json({ message: error.message || message });
};

// ======================== REGISTER USER ======================== //
const register = async (req, res) => {
    console.log("Register request received!");
    console.log("Request body:", req.body); // Debugging log to inspect incoming data
    console.log("Request file:", req.file); // Log the uploaded file

    try {
        const { firstName, lastName, email, password, nickname, address, addressLine2, city, state, zipCode } = req.body;

        // Get avatar path if a file was uploaded
        const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        const userProfile = await authService.registerUser({
            firstName,
            lastName,
            email,
            password,
            nickname,
            avatar: avatarPath, // Pass the avatar path
            address,
            addressLine2,
            city,
            state,
            zipCode
        });

        console.log('User profile after registration:', userProfile); // Debugging log

        return res.status(201).json({
            message: 'User registered successfully',
            user: userProfile
        });
    } catch (error) {
        if (error.message === 'This email is already in use.' || error.message === 'Missing required fields') {
            return res.status(400).json({ message: error.message });
        }
        return handleServerError(res, error, 'Registration error');
    }
};

// ======================== UPLOAD AVATAR ======================== //
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No avatar file provided' });
        }

        const avatarUrl = await authService.saveAvatarUrl(req.file.filename);
        
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
        
        const userProfile = await authService.loginUser({ email, password });
        
        console.log('Login successful. Sending user profile:', userProfile);
        return res.status(200).json({ message: 'Login successful', user: userProfile });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return handleServerError(res, error, 'Login error');
    }
};

// ======================== GET PROFILE ========================= //
const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const userProfile = await authService.getUserProfile(userId);
        
        console.log('Profile retrieved successfully');
        return res.status(200).json({ message: 'Profile retrieved successfully', user: userProfile });
    } catch (error) {
        if (error.message === 'Profile not found') {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return handleServerError(res, error, 'Get profile error');
    }
};

// ======================== UPDATE PROFILE ===================== //
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { firstName, lastName, email, nickname, avatar, address, addressLine2, city, state, zipCode } = req.body;
        
        // Get avatar path from file upload if present
        const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : avatar;
        
        const result = await authService.updateUserProfile(userId, { 
            firstName, lastName, email, nickname, 
            avatar: avatarPath, 
            address, addressLine2, city, state, zipCode 
        });
        
        console.log('Profile updated successfully:', result);
        return res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: result.user  // Include the updated user profile in the response
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