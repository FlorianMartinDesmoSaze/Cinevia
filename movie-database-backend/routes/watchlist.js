const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    console.log('Received GET request for /api/watchlist');
    console.log('User ID from token:', req.user.userId);

    const user = await User.findById(req.user.userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.watchlist);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a movie to watchlist
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received POST request to add to watchlist');
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

    if (!Array.isArray(user.watchlist)) {
      console.log('Watchlist is not an array, initializing it');
      user.watchlist = [];
    }

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    
    user.watchlist.push(movieId);
    await user.save();
    
    console.log('Updated user:', user);
    res.json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove a movie from watchlist
router.delete('/:movieId', auth, async (req, res) => {
  try {
    console.log('Received DELETE request for /api/watchlist/:movieId');
    console.log('User ID from token:', req.user.userId);
    console.log('Movie ID to remove:', req.params.movieId);

    const user = await User.findById(req.user.userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.watchlist)) {
      console.log('Watchlist is not an array, initializing it');
      user.watchlist = [];
    }

    const initialLength = user.watchlist.length;
    user.watchlist = user.watchlist.filter(id => id !== req.params.movieId);
    
    await user.save();
    
    console.log('Updated user:', user);
    res.json({ message: 'Movie removed from watchlist successfully', watchlist: user.watchlist });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;