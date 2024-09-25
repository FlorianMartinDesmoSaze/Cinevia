require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
const watchlistRoutes = require('./routes/watchlist');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Add this before your routes
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log('=================================');
    console.log('Movie Database Server Starting...');
    console.log(`Server running on port ${port}`);
    console.log('=================================');
  });
})
.catch((error) => console.error('MongoDB connection error:', error));

// Shutdown handler
process.on('SIGINT', () => {
  console.log('\n=================================');
  console.log('Movie Database Server Shutting Down...');
  console.log('=================================');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});
// Add this after all your other routes
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

module.exports = app;
