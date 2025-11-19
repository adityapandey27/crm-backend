const appointmentService = require('../services/appointment.service');

exports.createAppointment = async (req, res, next) => {
  try {
    const ap = await appointmentService.create(req.body);
    res.success('Appointment created', ap);
  } catch (err) {
    next(err);
  }
};

exports.getCurrentAppointment = async (req, res, next) => {
  try {
    const ap = await appointmentService.getCurrent(req.params.leadId);
    res.success('Current appointment', ap);
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentHistory = async (req, res, next) => {
  try {
    const history = await appointmentService.history(req.params.leadId);
    res.success('Appointment history', history);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const ap = await appointmentService.update(req.params.id, req.body);
    res.success('Appointment updated', ap);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    await appointmentService.remove(req.params.id);
    res.success('Appointment deleted');
  } catch (err) {
    next(err);
  }
};


exports.markDone = async (req, res, next) => {
  try {
    const ap = await appointmentService.markDone(req.params.id);
    res.success('Appointment marked done', ap);
  } catch (err) {
    next(err);
  }
};

exports.todayFollowups = async (req, res, next) => {
  try {
    const list = await appointmentService.getTodayFollowups();
    res.success('Today followups', list);
  } catch (err) {
    next(err);
  }
};


exports.getAllAppointments = async (req, res, next) => {
  try {
    const list = await appointmentService.getAll(req.query);
    res.success("All appointments", list);
  } catch (err) {
    next(err);
  }
};


exports.getCalendar = async (req, res, next) => {
  try {
    const data = await appointmentService.calendar();
    res.success("Calendar appointments", data);
  } catch (err) {
    next(err);
  }
};
