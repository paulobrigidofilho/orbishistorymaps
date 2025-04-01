// ======= Module imports ======= //
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');

// ======= BCRYPT CONFIGURATION ======= //

const saltRounds = 10;

// ======= DEFAULT AVATAR PATH ======= //

const defaultAvatarPath = '/uploads/avatars/pre-set/default.png'; // Adjust path if needed

const authController = {

  ///////////////////////////////////////////////////////////////////////
  // ========================= REGISTER CONTROLLER =================== //
  ///////////////////////////////////////////////////////////////////////

  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, nickname, avatar, address, city, zipCode } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Use default avatar if none provided
      const userAvatar = avatar || defaultAvatarPath;

      // Create user data object
      const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        nickname,
        avatar: userAvatar, // Use the determined avatar
        address,
        city,
        zipCode,
      };

      // Create user in the database
      userModel.createUser(userData, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Registration failed' });
        }

        console.log('User registered successfully');
        return res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Registration failed' });
    }
  },

  ///////////////////////////////////////////////////////////////////////
  // ========================= LOGIN CONTROLLER ====================== //
  ///////////////////////////////////////////////////////////////////////

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Retrieve user from the database
      userModel.getUserByEmail(email, async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Login failed' });
        }

        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        ///////////////////////////////////////////////////////////////////////
        // ========================= PASSWORD COMPARISON =================== //
        ///////////////////////////////////////////////////////////////////////

        console.log("Plaintext password:", password); // Password from the request
        console.log("Hashed password from DB:", user.USER_PASSWORD); // Password from the DB

        try {
            const passwordMatch = await bcrypt.compare(password, user.USER_PASSWORD);
            console.log("bcrypt.compare result:", passwordMatch);

            if (!passwordMatch) {
              console.log("Password does not match for email:", email);
              return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Use default avatar if none provided
            const userAvatar = user.USER_AVATAR || defaultAvatarPath;

            ///////////////////////////////////////////////////////////////////////
            // ========================= SUCCESSFUL LOGIN ====================== //
            ///////////////////////////////////////////////////////////////////////

            const userProfile = {
              USER_ID: user.USER_ID,
              USER_FIRSTNAME: user.USER_FIRSTNAME,
              USER_LASTNAME: user.USER_LASTNAME,
              USER_EMAIL: user.USER_EMAIL,
              USER_NICKNAME: user.USER_NICKNAME,
              USER_AVATAR: userAvatar, // Use the determined avatar
            };

            console.log('Login successful. Sending user profile:', userProfile); // User profile to be sent in the response

            return res.status(200).json({ message: 'Login successful', user: userProfile });
        } catch (compareError) {
            console.error("Error during bcrypt.compare:", compareError);
            return res.status(500).json({ message: 'Login failed (bcrypt error)' }); // More specific error
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  },
};

module.exports = authController;