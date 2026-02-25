const express = require('express');
const router = express.Router();
const StudyMaterial = require('../models/StudyMaterial');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const materials = await StudyMaterial.find({ schoolId });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id || !payload.schoolId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const material = new StudyMaterial(payload);
    const saved = await material.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const material = await StudyMaterial.findOne({ id: req.params.id });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await StudyMaterial.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
