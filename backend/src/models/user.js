const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Username of the user - a unique and required string.
  username: { type: String, required: true, unique: true },

  // Password for the user account - a required string.
  password: { type: String, required: true },

  // Category to denote if the user is a provider or claimer - optional.
  category: { type: String, required: false, enum: ['provider', 'claimer'] },

  // Score or reputation points for the user - defaults to 0.
  score: { type: Number, default: 0 },

  // URL to the user's profile picture - optional.
  profilePic: { type: String, required: false },

  // Geographical location of the user in GeoJSON format - optional.
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: false },
  },

  // Array of item IDs that the user has provided - optional.
  providedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],

  // Array of item IDs that the user has claimed - optional.
  claimedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

// Export the 'User' model based on 'userSchema'.
module.exports = mongoose.model('User', userSchema);
