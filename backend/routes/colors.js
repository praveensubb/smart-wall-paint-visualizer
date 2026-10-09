const express = require('express');
const Color = require('../models/Color');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, adminGuard, async (req, res) => {
  try {
    const color = new Color(req.body);
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, adminGuard, async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(color);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, adminGuard, async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    res.json({ message: 'Color deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
