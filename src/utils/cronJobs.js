const cron = require('node-cron');
const Appointment = require('../models/appointment.model');
const Lead = require('../models/lead.model');
// const emailService = require('./email.service');

const send24HourReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const start = new Date(tomorrow);
    start.setHours(0,0,0,0);
    const end = new Date(tomorrow);
    end.setHours(23,59,59,999);

    const appointments = await Appointment.find({ date: { $gte: start, $lte: end }, status: 'Upcoming' }).populate('leadId');
    // for (const ap of appointments) {
    //   if (ap.leadId && ap.leadId.email) {
    //     try {
    //       await emailService.sendSimpleEmail(ap.leadId.email, 'Appointment Reminder', `Reminder: you have appointment on ${new Date(ap.date).toLocaleString()}`);
    //     } catch (e) {
    //       console.error('Failed to send reminder', e.message);
    //     }
    //   }
    // }

    console.log(`24-hour reminders processed: ${appointments.length}`);
  } catch (err) {
    console.error('Error in 24-hour reminder job', err.message);
  }
};

exports.startAll = () => {
  // run every day at 00:10 server time
  cron.schedule('10 0 * * *', send24HourReminders);
};
