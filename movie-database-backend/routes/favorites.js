const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a movie to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
    
    user.favorites.push(movieId);
    await user.save();
    
    res.json(user.favorites);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a movie from favorites
router.delete('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(id => id !== parseInt(movieId));
    await user.save();
    
    res.json(user.favorites);
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;