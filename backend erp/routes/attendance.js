const express = require('express');
const router = express.Router();

// In-memory storage
let attendanceRecords = {};

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const records = attendanceRecords[schoolId] || [];
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.body.schoolId || 'school1';
    const records = req.body.records || [];
    
    if (!attendanceRecords[schoolId]) {
      attendanceRecords[schoolId] = [];
    }
    attendanceRecords[schoolId].push(...records);
    
    res.status(201).json({ message: 'Attendance marked', records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
