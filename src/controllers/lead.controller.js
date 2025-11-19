const leadService = require('../services/lead.service');

exports.createLead = async (req, res, next) => {
  try {
    const lead = await leadService.create(req.body, req.user);
    res.success('Lead created', lead);
  } catch (err) {
    next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await leadService.list(req.query);
    res.success('Leads fetched', leads);
  } catch (err) {
    next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getById(req.params.id);
    res.success('Lead fetched', lead);
  } catch (err) {
    next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.update(req.params.id, req.body);
    res.success('Lead updated', lead);
  } catch (err) {
    next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    await leadService.remove(req.params.id);
    res.success('Lead deleted');
  } catch (err) {
    next(err);
  }
};

exports.updateStage = async (req, res, next) => {
  try {
    const lead = await leadService.updateStage(req.params.id, req.body.stage);
    res.success('Stage updated', lead);
  } catch (err) {
    next(err);
  }
};

exports.getLeadAppointments = async (req, res, next) => {
  try {
    const apps = await leadService.getAppointments(req.params.id);
    res.success('Appointments fetched', apps);
  } catch (err) {
    next(err);
  }
};

exports.searchLeads = async (req, res, next) => {
  try {
    const results = await leadService.search(req.query);
    res.success('Search results', results);
  } catch (err) {
    next(err);
  }
};

exports.getTodayFollowups = async (req, res, next) => {
  try {
    const items = await leadService.todayFollowups();
    res.success('Today followups', items);
  } catch (err) {
    next(err);
  }
};
