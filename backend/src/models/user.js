const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique in the database
    lowercase: true, // Optional: Converts email to lowercase to avoid case-sensitive issues
    trim: true, // Optional: Removes leading and trailing whitespace
    match: [/.+\@.+\..+/, 'Please enter a valid email address'] // Optional: Simple regex for email validation
  },
  password: { type: String, required: true },

  // category: { type: String, required: true, enum: ['provider', 'claimer'] },
  score: { type: Number, default: 0 },
  // Add other relevant fields
});

module.exports = mongoose.model('User', userSchema);
