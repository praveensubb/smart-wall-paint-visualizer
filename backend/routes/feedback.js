const express = require('express');
const router = express.Router();

// Mock feedback route
router.post('/', async (req, res) => {
  res.status(201).json({ message: 'Feedback submitted' });
});

module.exports = router;
