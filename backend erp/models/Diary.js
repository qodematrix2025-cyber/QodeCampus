const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  date: { type: Date, default: Date.now },
  authorId: { type: String },
  type: { type: String, default: 'Notice' },
  attachments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Diary
  ? mongoose.models.Diary
  : mongoose.model('Diary', DiarySchema);
