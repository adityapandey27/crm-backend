const Lead = require('../models/lead.model');
const Appointment = require('../models/appointment.model');

exports.conversionRate = async () => {
  const total = await Lead.countDocuments();
  const converted = await Lead.countDocuments({ stage: 'Converted' });
  return { total, converted, rate: total === 0 ? 0 : (converted / total) };
};

exports.sourcePerformance = async () => {
  const agg = await Lead.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return agg;
};

exports.dateRange = async (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const leads = await Lead.find({ createdAt: { $gte: s, $lte: e } });
  const appointments = await Appointment.find({ createdAt: { $gte: s, $lte: e } });
  return { leadsCount: leads.length, appointmentsCount: appointments.length };
};
