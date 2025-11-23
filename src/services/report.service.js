const Lead = require('../models/lead.model');
const Appointment = require('../models/appointment.model');
const mongoose = require('mongoose');

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

// ---------------- NEW ----------------

// Helper to normalize date strings (yyyy-mm-dd) or ISO
function parseDateInput(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt;
}

/**
 * leadsWeekly(start, end)
 * returns array of objects: [{ date: '2025-11-10', count: 5 }, ...]
 * default: last 7 days (including today)
 */
exports.leadsWeekly = async (start, end) => {
  const today = new Date();
  let s = parseDateInput(start);
  let e = parseDateInput(end);
  if (!s || !e) {
    // default last 7 days
    e = new Date(today.setHours(23,59,59,999));
    s = new Date();
    s.setDate(s.getDate() - 6);
    s.setHours(0,0,0,0);
  } else {
    s.setHours(0,0,0,0);
    e.setHours(23,59,59,999);
  }

  const pipeline = [
    { $match: { createdAt: { $gte: s, $lte: e } } },
    { $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const agg = await Lead.aggregate(pipeline);
  // build full list of days between s and e
  const days = [];
  const cur = new Date(s);
  while (cur <= e) {
    const key = cur.toISOString().slice(0,10);
    const found = agg.find(a => a._id === key);
    days.push({ date: key, count: found ? found.count : 0 });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
};

/**
 * leadsByStage()
 * returns [{ stage: 'New', count: 10 }, ...]
 */
exports.leadsByStage = async () => {
  const agg = await Lead.aggregate([
    { $group: { _id: '$stage', count: { $sum: 1 } } },
    { $project: { stage: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);
  // ensure all stages appear (fill zero)
  const stages = ['New', 'Contacted', 'Qualified', 'Converted'];
  const map = {};
  agg.forEach(a => map[a.stage] = a.count);
  const res = stages.map(s => ({ stage: s, count: map[s] || 0 }));
  return res;
};

/**
 * conversionTrend()
 * Returns last 12 months data: [{ month: '2025-01', leads: 10, converted: 2, rate: 0.2 }, ...]
 */
exports.conversionTrend = async () => {
  const now = new Date();
  const months = [];
  // build last 12 months range
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    months.push({ key, year: d.getFullYear(), month: d.getMonth()+1, start: new Date(d.getFullYear(), d.getMonth(), 1), end: new Date(d.getFullYear(), d.getMonth()+1, 0, 23, 59, 59, 999) });
  }

  const results = [];
  for (const m of months) {
    const leadsCount = await Lead.countDocuments({ createdAt: { $gte: m.start, $lte: m.end } });
    const convertedCount = await Lead.countDocuments({ createdAt: { $gte: m.start, $lte: m.end }, stage: 'Converted' });
    const rate = leadsCount === 0 ? 0 : (convertedCount / leadsCount);
    results.push({ month: m.key, leads: leadsCount, converted: convertedCount, rate });
  }
  return results;
};

/**
 * upcomingFollowups(days)
 * returns upcoming appointments (next `days` days, default 7) sorted by date
 */
exports.upcomingFollowups = async (days = 7) => {
  const now = new Date();
  const end = new Date();
  end.setDate(now.getDate() + days);
  end.setHours(23,59,59,999);

  const appts = await Appointment.find({
    date: { $gte: now, $lte: end },
    status: { $in: ['Upcoming'] }
  })
  .populate('leadId', 'name email phone')
  .sort({ date: 1 })
  .lean();

  return appts.map(ap => ({
    _id: ap._id,
    leadId: ap.leadId?._id,
    lead: ap.leadId,
    date: ap.date,
    reason: ap.reason,
    note: ap.note,
    status: ap.status
  }));
};
