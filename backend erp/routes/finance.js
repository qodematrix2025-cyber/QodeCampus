const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const records = await Finance.find({ schoolId });
    res.json(records);
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
    const record = new Finance(payload);
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await Finance.findOne({ id: req.params.id });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Finance.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Finance.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
