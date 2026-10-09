const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/admin');
const router = express.Router();

router.use(auth, adminGuard);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/designs', async (req, res) => {
  try {
    const projects = await Project.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/activity', async (req, res) => {
  try {
    const logs = await ActivityLog.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDesigns = await Project.countDocuments();
    
    // Simplistic stats for KPI
    res.json({
      totalUsers,
      totalDesigns,
      imagesUploaded: totalDesigns,
      avgSessionDuration: '12 mins',
      feedbackCount: 0 // to be populated
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
