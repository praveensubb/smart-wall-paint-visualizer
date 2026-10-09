const express = require('express');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const project = new Project({
      userId: req.user._id,
      originalImageUrl: imageUrl
    });
    await project.save();
    await ActivityLog.create({ userId: req.user._id, action: 'Uploaded image' });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('wallSelections.colorId wallSelections.patternId wallSelections.dualToneColorId');
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.single('renderedImage'), async (req, res) => {
  try {
    const updateData = { wallSelections: JSON.parse(req.body.wallSelections || '[]') };
    if (req.file) {
      updateData.renderedImageUrl = `/uploads/${req.file.filename}`;
    }
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    await ActivityLog.create({ userId: req.user._id, action: 'Saved design' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
