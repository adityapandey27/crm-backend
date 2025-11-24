const AppointmentModel = require('../models/appointment.model');
const LeadModel = require('../models/lead.model');
const automationLog = require('../models/automationLog.model');
const emailService = require('./email.service');

// exports.create = async (data) => {
//   const { leadId, date } = data;
//   if (!leadId || !date) throw new Error('leadId and date required');
//   const ap = await AppointmentModel.create(data);
//   // if appointment is today or future, optionally notify
//   await automationLog.create({ type: 'appointment_created', leadId, message: `Appointment created for ${date}` });
//   // if configured, send an email here
//   try {
//     const lead = await LeadModel.findById(leadId);
//     if (lead && lead.email) {
//       await emailService.sendSimpleEmail(lead.email, 'Appointment Created', `Your appointment is scheduled on ${new Date(date).toLocaleString()}`);
//     }
//   } catch (e) { /* swallow */ }
//   return ap;
// };

exports.create = async (data) => {
  const { leadId, date } = data;

  if (!leadId || !date) {
    throw new Error("leadId and date required");
  }

  const appointment = await AppointmentModel.create(data);

  // Log creation
  await automationLog.create({
    type: "appointment_created",
    leadId,
    message: `Appointment created for ${date}`
  });

  try {
    const lead = await LeadModel.findById(leadId);

    if (lead && lead.email) {
      const formatted = new Date(date).toLocaleString();

      // OPTION A — Simple text email
      // await emailService.sendSimpleEmail(
      //   lead.email,
      //   "Appointment Scheduled",
      //   `Your appointment is scheduled on ${formatted}.`
      // );

      // OPTION B — Send beautiful HTML email (recommended)
      await emailService.send(
        lead.email,
        "Appointment Scheduled",
        `
          <h2>Your Appointment is Confirmed</h2>
          <p>Dear ${lead.name || "User"},</p>
          <p>Your appointment is scheduled on:</p>
          <p><strong>${formatted}</strong></p>
          <p>We look forward to assisting you.</p>
          <br/>
          <p>Regards,<br/>CRM Team</p>
        `
      );

      // OPTION C — Send using stored template (if you create one)
      // emailService.sendTemplate("appointment_created", lead.email, {
      //   name: lead.name,
      //   date: formatted
      // });
    }
  } catch (e) {
    // swallow errors so appointment creation does not break
    console.log("Email send failed:", e.message);
  }

  return appointment;
};


exports.getCurrent = async (leadId) => {
  const now = new Date();
  const ap = await AppointmentModel.findOne({ leadId, date: { $gte: now } }).sort({ date: 1 });
  return ap;
};

exports.history = async (leadId) => AppointmentModel.find({ leadId, status: { $in: ['Completed','Cancelled'] } }).sort({ date: -1 });

exports.update = async (id, data) => {
  const ap = await AppointmentModel.findByIdAndUpdate(id, data, { new: true });
  return ap;
};

exports.remove = async (id) => {
  await AppointmentModel.findByIdAndDelete(id);
  return true;
};


exports.markDone = async (id) => {
  return await AppointmentModel.findByIdAndUpdate(
    id,
    { status: 'Completed' },
    { new: true }
  );
};

exports.getTodayFollowups = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const list = await AppointmentModel.find({
    date: { $gte: start, $lte: end },
    status: { $in: ['Upcoming'] }
  })
    .populate('leadId', 'name email phone')
    .sort({ date: 1 });

  return list.map(ap => ({
    _id: ap._id,
    leadId: ap.leadId?._id,
    lead: ap.leadId,
    date: ap.date,
    reason: ap.reason,
    note: ap.note,
  }));
};


exports.getAll = async (query) => {
  let { status, start, end, search, sort = "date", order = "asc" } = query;

  const filter = {};

  if (status) filter.status = status;
  
  if (start && end) {
    filter.date = { $gte: new Date(start), $lte: new Date(end) };
  }

  if (search) {
    const leads = await LeadModel.find({
      name: { $regex: search, $options: "i" }
    }).select("_id");

    filter.leadId = { $in: leads.map(l => l._id) };
  }

  const list = await AppointmentModel.find(filter)
    .populate("leadId", "name phone email")
    .sort({ [sort]: order === "asc" ? 1 : -1 });

  return list;
};


exports.calendar = async () => {
  const appointments = await AppointmentModel.find()
    .populate("leadId", "name")
    .sort({ date: 1 });

  const calendar = {};

  appointments.forEach(ap => {
    const day = ap.date.toISOString().split("T")[0];

    if (!calendar[day]) calendar[day] = [];
    calendar[day].push({
      _id: ap._id,
      title: ap.reason,
      time: ap.date,
      lead: ap.leadId?.name,
      status: ap.status,
    });
  });

  return calendar;
};
