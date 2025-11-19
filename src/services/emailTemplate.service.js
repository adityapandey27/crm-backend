const EmailTemplate = require('../models/emailTemplate.model');

exports.create = async (data) => EmailTemplate.create(data);
exports.list = async () => EmailTemplate.find().sort({ createdAt: -1 });
exports.update = async (id, data) => EmailTemplate.findByIdAndUpdate(id, data, { new: true });
exports.remove = async (id) => EmailTemplate.findByIdAndDelete(id);
