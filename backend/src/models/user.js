const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  category: { type: String, required: true, enum: ['provider', 'claimer'] },
  score: { type: Number, default: 0 },
  // Add other relevant fields
});

module.exports = mongoose.model('User', userSchema);
