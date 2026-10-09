const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  imageUrl: { type: String, required: true },
  scale: { type: Number, default: 1 }
});

module.exports = mongoose.model('Pattern', patternSchema);
