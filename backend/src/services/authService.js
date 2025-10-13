// ======= Module imports ======= //
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// ======= BCRYPT CONFIGURATION ======= //
const saltRounds = config.authConfig.bcrypt.saltRounds;

///////////////////////////////////////////////////////////////////////
// ========================= HELPER FUNCTIONS ====================== //
///////////////////////////////////////////////////////////////////////

// Function to create a user profile object (removes sensitive data)
const createUserProfile = (user) => {
    console.log("Creating user profile from DB data:", user);
    
    // Return properly structured user data with proper field names
    return {
        id: user.user_id,
        firstName: user.user_firstname || '',
        lastName: user.user_lastname || '',
        email: user.user_email || '',
        nickname: user.user_nickname || '',
        avatar: user.user_avatar || '',
        address: user.user_address || '',
        addressLine2: user.user_address_line_2 || '',
        city: user.user_city || '',
        state: user.user_state || '',
        zipCode: user.user_zipcode || '',
    };
};

/////////////////////////////////////////////////////////////////////
// ======================= SERVICE FUNCTIONS ===================== //
/////////////////////////////////////////////////////////////////////

// ======================== REGISTER USER ======================== //
const registerUser = async (userData) => {
    const { firstName, lastName, email, password, nickname, avatar, address, city, state, zipCode, addressLine2 } = userData;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
        throw new Error('Missing required fields');
    }

    // Check if email already exists
    return new Promise((resolve, reject) => {
        userModel.getUserByEmail(email, async (err, existingUser) => {
            if (err) {
                return reject(err);
            }

            if (existingUser) {
                return reject(new Error('This email is already in use.'));
            }

            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const userId = uuidv4();

                const newUser = {
                    user_id: userId,
                    user_firstname: firstName,
                    user_lastname: lastName,
                    user_email: email,
                    user_password: hashedPassword,
                    user_nickname: nickname || '',
                    user_avatar: avatar || '',
                    user_address: address || '',
                    user_address_line_2: addressLine2 || '',
                    user_city: city || '',
                    user_state: state || '',
                    user_zipcode: zipCode || '',
                };

                // Create user in database
                userModel.createUser(newUser, (createErr) => {
                    if (createErr) {
                        return reject(createErr);
                    }

                    // Fetch the complete user profile from the database
                    userModel.getUserByEmail(email, (fetchErr, user) => {
                        if (fetchErr) {
                            return reject(fetchErr);
                        }

                        if (!user) {
                            return reject(new Error('User registered but not found'));
                        }

                        const userProfile = createUserProfile(user);
                        resolve(userProfile);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    });
};

// ======================== LOGIN USER ========================= //
const loginUser = async (credentials) => {
    const { email, password } = credentials;

    return new Promise((resolve, reject) => {
        userModel.getUserByEmail(email, async (err, user) => {
            if (err) {
                return reject(err);
            }

            if (!user) {
                return reject(new Error('Invalid credentials'));
            }

            try {
                const passwordMatch = await bcrypt.compare(password, user.user_password);

                if (!passwordMatch) {
                    return reject(new Error('Invalid credentials'));
                }

                const userProfile = createUserProfile(user);
                resolve(userProfile);
            } catch (compareError) {
                reject(compareError);
            }
        });
    });
};

// ======================== GET PROFILE ========================= //
const getUserProfile = async (userId) => {
    return new Promise((resolve, reject) => {
        userModel.getUserById(userId, (err, user) => {
            if (err) {
                return reject(err);
            }

            if (!user) {
                return reject(new Error('Profile not found'));
            }

            console.log("Raw user data from DB:", user);
            const userProfile = createUserProfile(user);
            console.log("Transformed user profile:", userProfile);
            
            resolve(userProfile);
        });
    });
};

// ======================== UPDATE PROFILE ===================== //
const updateUserProfile = async (userId, profileData) => {
    return new Promise((resolve, reject) => {
        userModel.updateUser(userId, profileData, (err, result) => {
            if (err) {
                return reject(err);
            }

            // After updating, fetch the updated user profile
            userModel.getUserById(userId, (fetchErr, user) => {
                if (fetchErr) {
                    return reject(fetchErr);
                }

                if (!user) {
                    return reject(new Error('User not found after update'));
                }

                const userProfile = createUserProfile(user);
                resolve({ result, user: userProfile });
            });
        });
    });
};

// ======================== UPLOAD AVATAR ======================== //
const saveAvatarUrl = async (filename) => {
    const avatarUrl = `/uploads/avatars/${filename}`;
    return avatarUrl;
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    saveAvatarUrl,
    createUserProfile
};
