const express = require('express');
const Pattern = require('../models/Pattern');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const patterns = await Pattern.find();
    res.json(patterns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, adminGuard, async (req, res) => {
  try {
    const pattern = new Pattern(req.body);
    await pattern.save();
    res.status(201).json(pattern);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, adminGuard, async (req, res) => {
  try {
    const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pattern);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, adminGuard, async (req, res) => {
  try {
    await Pattern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pattern deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
