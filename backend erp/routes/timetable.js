const express = require('express');
const router = express.Router();

// In-memory storage for timetable (replace with DB if needed)
let timetables = {};

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const entries = timetables[schoolId] || [];
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.body.schoolId || 'school1';
    const entries = req.body.entries || [];
    timetables[schoolId] = entries;
    res.status(201).json({ message: 'Timetable updated', entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
