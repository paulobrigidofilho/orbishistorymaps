/////////////////////////////////////////////////
// ================== AUTH SERVICE =========== //
/////////////////////////////////////////////////

// This service handles user authentication logic,
// including registration, login, profile management, and avatar handling.

// ======= Module Imports ======= //
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
    // Removed raw user dump to avoid leaking hashed password
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
                console.error('Error in getUserByEmail (register):', err);
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
                userModel.createUser(newUser, (createErr, createResult) => {
                    if (createErr) {
                        console.error('Error creating user:', createErr);
                        return reject(createErr);
                    }

                    // Verify the insert actually happened
                    if (!createResult || createResult.affectedRows === 0) {
                        console.error('User creation returned success but no rows affected');
                        return reject(new Error('Failed to create user in database'));
                    }

                    console.log(`User created successfully. Affected rows: ${createResult.affectedRows}`);

                    // Fetch the complete user profile from the database
                    userModel.getUserByEmail(email, (fetchErr, user) => {
                        if (fetchErr) {
                            console.error('Error fetching user after create:', fetchErr);
                            return reject(fetchErr);
                        }

                        if (!user) {
                            console.error('User was inserted but could not be retrieved');
                            return reject(new Error('User registered but not found'));
                        }

                        const userProfile = createUserProfile(user);
                        console.log('Registration complete. User profile:', { ...userProfile, id: userProfile.id });
                        resolve(userProfile);
                    });
                });
            } catch (error) {
                console.error('Unexpected error in registerUser:', error);
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
                console.error('Error in getUserByEmail (login):', err);
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
                console.error('Error comparing passwords:', compareError);
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
                console.error('Error in getUserById:', err);
                return reject(err);
            }

            if (!user) {
                return reject(new Error('Profile not found'));
            }

            const userProfile = createUserProfile(user);
            resolve(userProfile);
        });
    });
};

// ======================== UPDATE PROFILE ===================== //
const updateUserProfile = async (userId, profileData) => {
    return new Promise((resolve, reject) => {
        userModel.updateUser(userId, profileData, (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return reject(err);
            }

            // After updating, fetch the updated user profile
            userModel.getUserById(userId, (fetchErr, user) => {
                if (fetchErr) {
                    console.error('Error fetching user after update:', fetchErr);
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
