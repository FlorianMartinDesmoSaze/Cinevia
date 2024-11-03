const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.VERCEL_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB (if needed)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
}

// Handle all other routes
app.all('*', (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;