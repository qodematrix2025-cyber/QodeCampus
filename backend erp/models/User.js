const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin', enum: ['Admin', 'Teacher', 'Student', 'Parent', 'PlatformAdmin'] },
  schoolId: { type: String, default: 'school1' },
  linkedStudentId: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
