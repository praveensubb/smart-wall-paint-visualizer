const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalImageUrl: { type: String, required: true },
  wallSelections: [{
    polygon: [{ x: Number, y: Number }],
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
    patternId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pattern' },
    opacity: { type: Number, default: 1 },
    finish: { type: String, enum: ['matte', 'glossy'], default: 'matte' },
    brightness: { type: Number, default: 1 },
    dualToneColorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }
  }],
  renderedImageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
