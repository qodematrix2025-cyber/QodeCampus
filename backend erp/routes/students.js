const express = require('express');
const router = express.Router();
let Student = require('../models/Student');

// GET all students (optionally filter by schoolId)
router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const students = await Student.find({ schoolId }).lean();
    const normalized = students.map(s => {
      if ((!s.firstName && !s.lastName) && s.name) {
        const parts = String(s.name).split(' ').filter(Boolean);
        s.firstName = parts.shift() || '';
        s.lastName = parts.join(' ') || '';
      }
      return s;
    });
    res.json(normalized);
  } catch (err) {
    console.error('Error fetching students:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - Register a new student
router.post('/register', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.id || !payload.schoolId) {
      return res.status(400).json({ error: 'Missing required student fields (id, schoolId)' });
    }

    // ensure name compatibility: if frontend sent `name`, split into first/last
    const savePayload = Object.assign({}, payload);
    if (savePayload.name && !(savePayload.firstName || savePayload.lastName)) {
      const parts = String(savePayload.name).split(' ').filter(Boolean);
      savePayload.firstName = parts.shift() || '';
      savePayload.lastName = parts.join(' ') || '';
    }
    // ensure we also store a friendly `name` field for compatibility
    if (!savePayload.name && (savePayload.firstName || savePayload.lastName)) {
      savePayload.name = `${savePayload.firstName || ''} ${savePayload.lastName || ''}`.trim();
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ id: savePayload.id });
    if (existingStudent) {
      return res.status(409).json({ error: 'Student already registered' });
    }

    const newStudent = new Student(savePayload);
    const savedStudent = await newStudent.save();
    const result = savedStudent.toObject ? savedStudent.toObject() : savedStudent;
    res.status(201).json(result);
  } catch (err) {
    console.error('Error registering student:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET a single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id }).lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if ((!student.firstName && !student.lastName) && student.name) {
      const parts = String(student.name).split(' ').filter(Boolean);
      student.firstName = parts.shift() || '';
      student.lastName = parts.join(' ') || '';
    }
    // fallback to id for display if no name
    if (!student.firstName && !student.lastName) student.name = student.name || student.id;
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ id: req.params.id });
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;