const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // status: { type: String, required: false, enum: ['available', 'claimed'] },
  // Add other relevant fields
});

module.exports = mongoose.model('Item', itemSchema);
