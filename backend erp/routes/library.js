const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const schoolId = req.headers['school-id'] || req.query.schoolId || 'school1';
    const books = await Book.find({ schoolId });
    res.json(books);
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
    const book = new Book(payload);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/issue', async (req, res) => {
  try {
    const { bookId, studentId } = req.body;
    if (!bookId || !studentId) {
      return res.status(400).json({ error: 'Missing bookId or studentId' });
    }
    const book = await Book.findOne({ id: bookId });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (!book.issuedTo) book.issuedTo = [];
    book.issuedTo.push(studentId);
    book.available = (book.quantity || 1) - book.issuedTo.length;
    const updated = await book.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/return', async (req, res) => {
  try {
    const { bookId, studentId } = req.body;
    if (!bookId) return res.status(400).json({ error: 'Missing bookId' });
    const book = await Book.findOne({ id: bookId });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (studentId && book.issuedTo) {
      book.issuedTo = book.issuedTo.filter(id => id !== studentId);
    }
    book.available = (book.quantity || 1) - (book.issuedTo ? book.issuedTo.length : 0);
    const updated = await book.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
