const express = require('express');
const router = express.Router();

// In-memory storage (replace with DB if needed)
let exams = { schedules: [], reports: [] };

router.get('/schedules', async (req, res) => {
  try {
    res.json(exams.schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/schedules', async (req, res) => {
  try {
    const payload = req.body;
    exams.schedules.push(payload);
    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reports', async (req, res) => {
  try {
    res.json(exams.reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reports', async (req, res) => {
  try {
    const payload = req.body;
    exams.reports.push(payload);
    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
