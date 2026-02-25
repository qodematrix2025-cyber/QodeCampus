const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  // friendly/full name used by frontend
  name: { type: String },
  // keep first/last for compatibility
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  // frontend fields
  subject: { type: String },
  classesAssigned: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 0 },
  classTeacherOf: { type: String },
  phone: { type: String },
  joiningDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Teacher
  ? mongoose.models.Teacher
  : mongoose.model('Teacher', TeacherSchema);
