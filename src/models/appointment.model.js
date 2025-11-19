const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  date: { type: Date, required: true },
  problem: { type: String },
  solution: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
