const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

function normalizeTeacherPayload(payload) {
  const p = Object.assign({}, payload);
  if (p.name && !(p.firstName || p.lastName)) {
    const parts = String(p.name).split(' ').filter(Boolean);
    p.firstName = parts.shift() || '';
    p.lastName = parts.join(' ') || '';
  }
  if (!p.name && (p.firstName || p.lastName)) {
    p.name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
  }
  return p;
}

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const teachers = await Teacher.find({ schoolId }).lean();
    const normalized = teachers.map(t => {
      if (!t.name) {
        if (t.firstName || t.lastName) t.name = `${t.firstName || ''} ${t.lastName || ''}`.trim();
        else t.name = t.id;
      }
      return t;
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.id || !payload.schoolId) {
      return res.status(400).json({ error: 'Missing required teacher fields' });
    }
    const savePayload = normalizeTeacherPayload(payload);
    const newTeacher = new Teacher(savePayload);
    const savedTeacher = await newTeacher.save();
    const result = savedTeacher.toObject ? savedTeacher.toObject() : savedTeacher;
    if (!result.name) result.name = `${result.firstName || ''} ${result.lastName || ''}`.trim() || result.id;
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ id: req.params.id }).lean();
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    if (!teacher.name) teacher.name = `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.id;
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const payload = normalizeTeacherPayload(req.body || {});
    const updated = await Teacher.findOneAndUpdate({ id: req.params.id }, payload, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: 'Teacher not found' });
    if (!updated.name) updated.name = `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.id;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Teacher.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
