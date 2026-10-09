const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favouriteColors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
  favouritePatterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pattern' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
