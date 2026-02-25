const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	schoolId: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	grade: { type: String },
	attendancePct: { type: Number, default: 100 },
	feesStatus: { type: String, default: 'Pending' },
	gpa: { type: Number, default: 0 },
	parentEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Student
	? mongoose.models.Student
	: mongoose.model('Student', StudentSchema);
