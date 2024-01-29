const mongoose = require('mongoose');

/**
 * Schema definition for the 'Item' model.
 */
const itemSchema = new mongoose.Schema({
  // Name of the item - a required string.
  name: { type: String, required: true },

  // Description of the item - a required string.
  description: { type: String, required: true },

  creationDate: { type: Date, default: Date.now },
  
  // Binary data of the image
  image: {
    type: Buffer,
    required: false
  },

  // Geographical location of the item in GeoJSON format - optional.
  // 'coordinates' should be in [longitude, latitude] format.
  // Both 'type' and 'coordinates' are optional.
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: function() { return !!this.location; }
    },
    coordinates: {
      type: [Number],
      required: function() { return !!this.location; }
    },
  },

  // Reference to the User model for the user who provides the item - optional.
  providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  // Reference to the User model for the user who claims the item - optional.
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  // Tags associated with the item - an array of strings, optional.
  tags: { type: [String], required: false }
});

/**
 * Geospatial index on the 'location' field to enable efficient 
 * location-based queries, like finding items near a specific point.
 * This index is created only if 'location.coordinates' field exists.
 */
itemSchema.index({ location: '2dsphere' }, { sparse: true });

// Export the 'Item' model based on 'itemSchema'.
module.exports = mongoose.model('Item', itemSchema);
