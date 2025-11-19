const Lead = require('../models/lead.model');
const Appointment = require('../models/appointment.model');

exports.create = async (data, user) => {
  const doc = await Lead.create({ ...data, createdBy: user.id });
  return doc;
};

// services/lead.service.js (only the list function shown / replace existing list)
exports.list = async (query) => {
  const filter = {};
  // stage, source, name already supported
  if (query.stage) filter.stage = query.stage;
  if (query.source) filter.source = query.source;
  if (query.name) filter.name = { $regex: query.name, $options: 'i' };

  // created date range support
  // expected query keys: createdFrom, createdTo (ISO date strings or yyyy-mm-dd)
  if (query.createdFrom || query.createdTo) {
    filter.createdAt = {};
    if (query.createdFrom) {
      const from = new Date(query.createdFrom);
      from.setHours(0,0,0,0);
      filter.createdAt.$gte = from;
    }
    if (query.createdTo) {
      const to = new Date(query.createdTo);
      to.setHours(23,59,59,999);
      filter.createdAt.$lte = to;
    }
  }

  // sort newest first
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  return leads;
};

exports.getById = async (id) => Lead.findById(id);

exports.update = async (id, data) => {
  return await Lead.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  await Lead.findByIdAndDelete(id);
  // cascade delete appointments
  await Appointment.deleteMany({ leadId: id });
  return true;
};

exports.updateStage = async (id, stage) => {
  if (!['New','Contacted','Qualified','Converted'].includes(stage)) throw new Error('Invalid stage');
  const lead = await Lead.findByIdAndUpdate(id, { stage }, { new: true });
  return lead;
};

exports.getAppointments = async (leadId) => Appointment.find({ leadId }).sort({ date: -1 });

exports.search = async (q) => {
  const filter = {};
  if (q.name) filter.name = { $regex: q.name, $options: 'i' };
  if (q.source) filter.source = q.source;
  if (q.stage) filter.stage = q.stage;
  const res = await Lead.find(filter).limit(100);
  return res;
};

exports.todayFollowups = async () => {
  const start = new Date();
  start.setHours(0,0,0,0);
  const end = new Date();
  end.setHours(23,59,59,999);
  const apps = await Appointment.find({ date: { $gte: start, $lte: end }, status: 'Upcoming' }).populate('leadId');
  return apps;
};
