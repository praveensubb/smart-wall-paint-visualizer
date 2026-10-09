const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  rgb: { type: String },
  brand: { type: String, default: 'Generic' },
  finishOptions: [{ type: String, enum: ['matte', 'glossy', 'satin', 'eggshell'] }],
  categoryTags: [{ type: String }],
  swatchUrl: { type: String }
});

module.exports = mongoose.model('Color', colorSchema);
