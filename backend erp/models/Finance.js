const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  schoolId: { type: String, required: true },
  studentId: { type: String },
  amount: { type: Number },
  type: { type: String, enum: ['Fee', 'Expense', 'Revenue'] },
  category: { type: String },
  date: { type: Date, default: Date.now },
  description: { type: String },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.models && mongoose.models.Finance
  ? mongoose.models.Finance
  : mongoose.model('Finance', FinanceSchema);
