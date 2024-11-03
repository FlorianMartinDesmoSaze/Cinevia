const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const csrf = require('csurf');

const router = express.Router();

const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection to all routes except login and register
router.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }
  csrfProtection(req, res, next);
});

// Login route (no CSRF protection)
router.post('/login', async (req, res) => {
  try {
    // Your existing login logic
    // ...
    
    // After successful login, generate a new CSRF token
    const csrfToken = req.csrfToken ? req.csrfToken() : '';
    res.cookie('XSRF-TOKEN', csrfToken, { httpOnly: false, sameSite: 'Strict' });
    
    // Send the response with the token
    res.json({ token: 'your-auth-token' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/register', [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    console.log('Registration attempt:', email);
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    user = new User({ username, email, password });
    console.log('User before save:', user);
    await user.save();
    console.log('User after save:', user);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

router.get('/profile', auth, async (req, res) => {
  console.log('Profile route hit');
  console.log('User ID from auth middleware:', req.user.userId);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User data:', user);
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/checkuser/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ message: 'User found', email: user.email });
    } else {
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // The pre-save hook will hash this
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Email
router.put('/update-email', auth, async (req, res) => {
  try {
    console.log('Update email route hit');
    console.log('User ID from token:', req.user.userId);
    const { newEmail, password } = req.body;
    console.log('Request body:', { newEmail, password: password ? '******' : 'undefined' });

    if (!password) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.email);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if the new email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      console.log('Email already in use');
      return res.status(400).json({ message: 'Email is already in use' });
    }

    user.email = newEmail;
    await user.save();

    console.log('Email updated successfully');
    res.json({ message: 'Email updated successfully', user: { email: user.email, username: user.username } });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Username
router.put('/update-username', auth, async (req, res) => {
  try {
    console.log('Update username route hit');
    console.log('User ID from token:', req.user.userId);
    const { newUsername, password } = req.body;
    console.log('Request body:', { newUsername, password: password ? '******' : 'undefined' });

    if (!password) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.username);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if the new username is already in use
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      console.log('Username already in use');
      return res.status(400).json({ message: 'Username is already in use' });
    }

    user.username = newUsername;
    await user.save();

    console.log('Username updated successfully');
    res.json({ message: 'Username updated successfully', user: { email: user.email, username: user.username } });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    console.log('Update profile route hit');
    console.log('User ID from token:', req.user.userId);
    console.log('Request body:', req.body);

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.username, user.email);

    // Update fields
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    // Add any other fields you want to be updatable

    await user.save();
    console.log('Profile updated successfully');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;