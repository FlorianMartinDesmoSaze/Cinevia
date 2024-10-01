const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String }], // Array of movie IDs
  watchlist: [{ type: String }], // Array of movie IDs
  watched: [ // New field: Array of watched movie IDs
    {
      movieId: { type: String, required: true },
      watchedDate: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword) {
    console.log('Candidate password is undefined or empty');
    return false;
  }
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);