const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  title: { type: String },
  subject: { type: String },
  grade: { type: String },
  fileUrl: { type: String },
  uploadedBy: { type: String },
  uploadedDate: { type: Date, default: Date.now },
  type: { type: String, default: 'Document' }
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.StudyMaterial
  ? mongoose.models.StudyMaterial
  : mongoose.model('StudyMaterial', StudyMaterialSchema);
