const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  title: { type: String },
  author: { type: String },
  isbn: { type: String },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  category: { type: String },
  issuedTo: [{ type: String }],
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Book
  ? mongoose.models.Book
  : mongoose.model('Book', BookSchema);
