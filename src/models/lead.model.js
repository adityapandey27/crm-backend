const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  stage: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Converted'],
    default: 'New'
  },
  source: { type: String, enum: ['Google', 'Referral', 'Website', 'Other'], default: 'Other' },
  note: { type: String, default: '' },
  score: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Cold' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
