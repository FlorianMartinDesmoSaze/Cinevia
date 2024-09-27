const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user's watched movies
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.watched);
  } catch (error) {
    console.error('Error getting watched movies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a movie to watched list
router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyWatched = user.watched.find(item => item.movieId === movieId);
    if (alreadyWatched) {
      alreadyWatched.watchedDate = new Date();
    } else {
      user.watched.push({ movieId, watchedDate: new Date() });
    }

    await user.save();
    res.json({ message: 'Movie added to watched list', watched: user.watched });
  } catch (error) {
    console.error('Error adding to watched list:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove a movie from watched list
router.delete('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watched = user.watched.filter(item => item.movieId !== req.params.movieId);

    await user.save();
    
    res.json({ message: 'Movie removed from watched list', watched: user.watched });
  } catch (error) {
    console.error('Error removing from watched list:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's watched movies statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const watchedCount = user.watched ? user.watched.length : 0;
    const recentlyWatched = user.watched ? user.watched.slice(-5).reverse() : []; // Get last 5 watched movies

    res.json({
      watchedCount,
      recentlyWatched
    });
  } catch (error) {
    console.error('Error getting watched movies stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if a movie is watched
router.get('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isWatched = user.watched.some(item => item.movieId === req.params.movieId);
    res.json({ isWatched });
  } catch (error) {
    console.error('Error checking watched status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;