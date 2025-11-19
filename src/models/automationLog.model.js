const mongoose = require('mongoose');

const automationLogSchema = new mongoose.Schema({
  type: { type: String },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AutomationLog', automationLogSchema);
