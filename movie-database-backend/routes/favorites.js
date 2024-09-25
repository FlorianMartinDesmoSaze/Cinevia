const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    console.log('Auth middleware user:', req.user);
    console.log('Auth middleware userId:', req.user.userId);
    
    let userId = req.user.userId || req.user._id;
    console.log('Using userId:', userId);

    const user = await User.findById(userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in GET /favorites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a movie to favorites
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received POST request to add favorite');
    console.log('User ID from token:', req.user.userId);
    console.log('Request body:', req.body);

    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required' });
    }

    const user = await User.findById(req.user.userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.favorites)) {
      console.log('Favorites is not an array, initializing it');
      user.favorites = [];
    }

    const movieIdString = movieId.toString();
    if (!user.favorites.includes(movieIdString)) {
      user.favorites.push(movieIdString);
      await user.save();
    }
    
    console.log('Updated user:', user);
    res.json(user.favorites);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove a movie from favorites
router.delete('/:movieId', auth, async (req, res) => {
  try {
    console.log('Received DELETE request for /api/favorites/:movieId');
    console.log('User ID from token:', req.user.userId);
    console.log('Movie ID to remove:', req.params.movieId);

    const user = await User.findById(req.user.userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.favorites)) {
      console.log('Favorites is not an array, initializing it');
      user.favorites = [];
    }

    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(id => id !== req.params.movieId);
    
    await user.save();
    
    console.log('Updated user:', user);
    res.json({ message: 'Movie removed from favorites successfully', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;