const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');

const authController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, nickname, avatar, address, city, zipCode } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user data object
      const userData = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        nickname,
        avatar,
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

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.USER_PASSWORD);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a user object to send back to the client (exclude sensitive data)
        const userProfile = {
          USER_ID: user.USER_ID,
          USER_FIRSTNAME: user.USER_FIRSTNAME,
          USER_LASTNAME: user.USER_LASTNAME,
          USER_EMAIL: user.USER_EMAIL,
          USER_NICKNAME: user.USER_NICKNAME,
          USER_AVATAR: user.USER_AVATAR,
          // Add other non-sensitive user data here
        };

        console.log('Login successful');
        return res.status(200).json({ message: 'Login successful', user: userProfile });
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  },

};

module.exports = authController;